import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 文件数据类型
type FileItem = {
  id: string;
  name: string;
  type: keyof typeof fileTypeIcons;
  subject: string;
  size: string;
  date: string;
  downloads: number;
};

// 文件类型图标映射q
const fileTypeIcons = {
  pdf: 'fa-file-pdf',
  docx: 'fa-file-word',
  ppt: 'fa-file-powerpoint',
  pptx: 'fa-file-powerpoint',
  audio: 'fa-file-audio',
  default: 'fa-file'
} as const;

// 学科分类
const subjects = ['全部', '语文', '数学', '英语', '科学'] as const;

// 模拟文件数据
const mockFiles: FileItem[] = [
  { id: '1', name: '数学期中考试卷.pdf', type: 'pdf', subject: '数学', size: '2.4MB', date: '2025-06-08', downloads: 15 },
  { id: '2', name: '语文作文范文.docx', type: 'docx', subject: '语文', size: '1.2MB', date: '2025-06-07', downloads: 23 },
  { id: '3', name: '英语听力练习.mp3', type: 'audio', subject: '英语', size: '5.7MB', date: '2025-06-06', downloads: 8 },
  { id: '4', name: '科学实验指导.pptx', type: 'pptx', subject: '科学', size: '8.1MB', date: '2025-06-01', downloads: 12 },
  { id: '5', name: '数学练习题集.pdf', type: 'pdf', subject: '数学', size: '3.5MB', date: '2025-05-30', downloads: 18 },
];

export default function Resources() {
  const { isAuthenticated, user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [selectedSubject, setSelectedSubject] = useState<(typeof subjects)[number]>('全部');
  const [uploading, setUploading] = useState(false);

  // 处理下载
  const handleDownload = (id: string) => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    setFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, downloads: file.downloads + 1 } : file
      )
    );
    toast.success('开始下载');
  };

  // 处理上传
  const handleUpload = () => {
    if (!isAuthenticated || user?.type !== 'teacher') {
      toast.error('只有老师可以上传文件');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      const newFile: FileItem = {
        id: `${files.length + 1}`,
        name: `新文件${files.length + 1}.pdf`,
        type: 'pdf',
        subject: selectedSubject === '全部' ? '数学' : selectedSubject,
        size: '1.0MB',
        date: new Date().toISOString().split('T')[0],
        downloads: 0
      };
      setFiles(prev => [newFile, ...prev]);
      setUploading(false);
      toast.success('上传成功');
    }, 1000);
  };

  // 过滤文件按学科
  const filteredFiles = useMemo(
    () =>
      selectedSubject === '全部'
        ? files
        : files.filter(file => file.subject === selectedSubject),
    [files, selectedSubject]
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
      {/* 顶部导航栏 */}
      <header className="bg-[#06AED5] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">资源中心</h1>
          <div>
            {isAuthenticated ? (
              <span className="text-sm">欢迎，{user?.name}</span>
            ) : (
              <span className="text-sm">请先登录</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8">
        {/* 上传区 */}
        {isAuthenticated && user?.type === 'teacher' && (
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={cn(
                "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-all mr-4",
                uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <i className="fa-solid fa-upload mr-2"></i>
              {uploading ? '上传中...' : '上传文件'}
            </button>
            <div className="text-sm text-gray-500 flex items-center">
              <i className="fa-solid fa-info-circle text-blue-500 mr-1"></i>
              支持格式: PDF, DOCX, PPT, MP3
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* 学科分类导航 */}
          <aside className="hidden md:block w-48">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <div className="font-bold mb-2">学科分类</div>
              <ul>
                {subjects.map(subject => (
                  <li key={subject}>
                    <button
                      className={cn(
                        "w-full text-left px-2 py-1 rounded transition",
                        selectedSubject === subject
                          ? "bg-[#06AED5] text-white font-bold"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* 文件列表 */}
          <section className="flex-1">
            <div className="mb-4 md:hidden">
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedSubject}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedSubject(e.target.value as (typeof subjects)[number])
                }
              >
                {subjects.map((subject: (typeof subjects)[number]) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            {filteredFiles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-400">
                <i className="fa-regular fa-folder-open text-4xl mb-2"></i>
                <p>暂无文件</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学科</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">下载</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFiles.map(file => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className={`fa-solid ${fileTypeIcons[file.type] || fileTypeIcons.default} text-xl mr-3 text-blue-500`}></i>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.downloads}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDownload(file.id)}
                            className="text-[#06AED5] hover:text-[#0599c0] font-medium"
                          >
                            下载
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 底部版权 */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 快乐班级 - 小学互动平台</p>
      </footer>
    </div>
  );
}
