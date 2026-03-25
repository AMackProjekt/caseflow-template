"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, FileUp, Search, Filter, MoreHorizontal, FileImage, FileCode, CheckCircle2, Download, Trash2, FolderOpen, UserPlus, X } from "lucide-react";
import { useStaff } from "@/context/StaffContext";
import { useSession } from "next-auth/react";

export default function DocumentCenter() {
  const { documents: contextDocs, participants, addDocument, updateDocumentClient } = useStaff();
  const { data: session } = useSession();
  const [documents, setDocuments] = useState(contextDocs);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const CASELOAD_PARTICIPANTS = participants.map(p => `${p.name} (${p.slot})`);

  // Typeahead state
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when typing outside
  useEffect(() => {
    setDocuments(contextDocs);
  }, [contextDocs]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClients = clientSearch 
    ? CASELOAD_PARTICIPANTS.filter(c => c.toLowerCase().includes(clientSearch.toLowerCase())) 
    : CASELOAD_PARTICIPANTS;

  const [uploadError, setUploadError] = useState<string | null>(null);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("client", selectedClient || "Unassigned/General");

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed.");
        return;
      }

      const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const newDoc = {
        _id: `pending-${Date.now()}`,
        name: file.name,
        type: ext,
        size: `${sizeMb} MB`,
        client: selectedClient || "Unassigned/General",
        date: "Just now",
        uploader: session?.user?.email ?? session?.user?.name ?? "staff",
        url: json.url as string,
      };
      setDocuments(prev => [newDoc, ...prev]);
      addDocument(newDoc);
      setClientSearch("");
      setSelectedClient("");
    } catch {
      setUploadError("Network error — please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAssignFromTable = (docId: string, newClient: string) => {
    if (!newClient) return;
    setDocuments(docs => docs.map(d => d._id === docId ? { ...d, client: newClient } : d));
    updateDocumentClient(docId, newClient);
  };

  const getFileIcon = (type: string) => {
    if (type === "PDF") return <FileText className="w-8 h-8 text-rose-500" />;
    if (type === "DOCX") return <FileCode className="w-8 h-8 text-blue-500" />;
    if (type === "IMAGE") return <FileImage className="w-8 h-8 text-amber-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Document Center</h1>
          <p className="text-slate-500 mt-1">Manage, upload, and securely assign documents to CaseFlow participant records.</p>
        </div>
        <div className="bg-slate-100/80 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">M</div>
          <div className="text-sm">
            <p className="text-charcoal-900 font-bold text-xs leading-tight">Mack</p>
            <p className="text-teal-600 font-bold text-[10px] uppercase tracking-tighter">The Champ</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
            <h2 className="font-bold text-lg text-charcoal-900 mb-4 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-teal-600" />
              Upload New Document
            </h2>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                isDragging 
                  ? "border-teal-500 bg-teal-50 scale-[1.02]" 
                  : "border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center space-y-4 py-6">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="font-semibold text-teal-700 animate-pulse">Encrypting & Uploading...</p>
                </div>
              ) : (
                <>
                  <div className={`p-4 rounded-full ${isDragging ? "bg-teal-100 text-teal-600 outline outline-4 outline-teal-50" : "bg-white text-slate-400 shadow-sm"}`}>
                    <FileUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 text-base">Drag & drop a file here</h3>
                    <p className="text-slate-500 text-sm mt-1">PDF, DOCX, JPG or PNG up to 25MB</p>
                  </div>
                  
                  <div className="mt-2 w-full flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">or</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <label className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-sm w-full">
                    Browse Files
                    <input type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleManualUpload} />
                  </label>
                </>
              )}
            </div>

            {uploadError && (
              <p className="mt-3 text-sm text-rose-600 font-medium bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {uploadError}
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Direct Attachment Details</h3>
              <div className="space-y-4">
                
                {/* ADVANCED TYPEAHEAD COMBOBOX */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Link to Participant (Optional)</label>
                  
                  {selectedClient ? (
                    <div className="flex items-center justify-between w-full bg-teal-50 border border-teal-200 text-teal-800 font-medium rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-teal-600" />
                        <span className="text-sm">{selectedClient}</span>
                      </div>
                      <button 
                        title="Clear selected participant"
                        onClick={() => setSelectedClient("")}
                        className="text-teal-600 hover:text-teal-800 bg-teal-100 hover:bg-teal-200 p-1 rounded-md transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search all participants..."
                        value={clientSearch}
                        onFocus={() => setShowDropdown(true)}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setShowDropdown(true);
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-sm"
                      />
                    </div>
                  )}

                  {showDropdown && !selectedClient && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        <ul className="py-1">
                          <li 
                            className="px-3 py-2 text-sm text-slate-500 italic hover:bg-slate-50 cursor-pointer"
                            onClick={() => {
                              setSelectedClient("");
                              setClientSearch("");
                              setShowDropdown(false);
                            }}
                          >
                            Leave Unassigned
                          </li>
                          {filteredClients.map((client, i) => (
                            <li 
                              key={i} 
                              className="px-3 py-2 text-sm text-charcoal-900 hover:bg-teal-50 hover:text-teal-800 cursor-pointer transition font-medium border-t border-slate-50"
                              onClick={() => {
                                setSelectedClient(client);
                                setClientSearch("");
                                setShowDropdown(false);
                              }}
                            >
                              {client}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-sm text-slate-500 text-center">No participants found</div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Document Category</label>
                  <select title="Document Category" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer">
                    <option>SOP Audit Packet</option>
                    <option>Housing / Section 8</option>
                    <option>Medical Records</option>
                    <option>Identification Replacement</option>
                    <option>General Notes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900">Secure Uploader Active</h4>
              <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                All uploaded documents are encrypted and tracked under your authenticated account.
              </p>
            </div>
          </div>

        </div>

        {/* Repository Table (Right Column) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative max-w-sm w-full">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search files or participants..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  <FolderOpen className="w-4 h-4" /> Folders
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto flex-1">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 h-full min-h-[400px]">
                  <FileText className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-lg font-medium text-slate-600">No documents found</p>
                  <p className="text-sm">Upload a new file to get started.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold sticky top-0 z-10">
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4 hidden md:table-cell">Participant</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Date Added</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc, index) => (
                      <tr key={index} className="group transition-colors bg-white hover:bg-teal-50/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0 group-hover:bg-white transition-colors">
                              {getFileIcon(doc.type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-charcoal-900 group-hover:text-teal-700 transition-colors">
                                {doc.name}
                              </span>
                              <span className="text-xs font-medium text-slate-400 mt-0.5">
                                {doc.size} • Uploaded by {doc.uploader.split('@')[0]}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          {doc.client !== "Unassigned/General" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {doc.client}
                            </span>
                          ) : (
                            <select
                title="Assign to participant"
                onChange={(e) => handleAssignFromTable(doc._id, e.target.value)}
                              className="w-full max-w-[180px] bg-amber-50 border border-amber-200 text-amber-700 font-semibold rounded-md px-2 py-1 outline-none text-xs cursor-pointer focus:ring-2 focus:ring-amber-500/20"
                            >
                              <option value="">+ Assign Client</option>
                              {CASELOAD_PARTICIPANTS.map((client, i) => (
                                <option key={i} value={client}>{client}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="text-sm text-slate-500 font-medium">
                            {doc.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors focus:outline-none"
                              title="Download"
                              onClick={() => {
                                if ((doc as { url?: string }).url) {
                                  window.location.href = `/api/download?url=${encodeURIComponent((doc as { url?: string }).url!)}`;
                                }
                              }}
                              disabled={!(doc as { url?: string }).url}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="More options" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none ml-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Status Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Cloud Storage Selected
              </div>
              <p>{documents.length} files total • 10.4 MB Used</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
