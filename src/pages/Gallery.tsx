import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 照片数据类型
type Photo = {
  id: string;
  url: string;
  likes: number;
  category: string;
  date: string;
};

// 模拟照片数据
const mockPhotos: Photo[] = [
  { id: '1', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=happy%20students%20in%20classroom&sign=9b7b349a2ecb8ac884bf4d8e48051640', likes: 15, category: '活动', date: '2025-06-08' },
  { id: '2', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=school%20sports%20day&sign=a02f47bffe4bb67e6a5b4b27a8614d07', likes: 23, category: '活动', date: '2025-06-07' },
  { id: '3', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20class%20exhibition&sign=f3a5d399438793aa8b7a86d0709915dd', likes: 8, category: '学习', date: '2025-06-06' },
  { id: '4', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=teacher%20with%20students&sign=90b9bf20e8f22a16b8f764503f46157f', likes: 32, category: '日常', date: '2025-06-01' },
  { id: '5', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=school%20library&sign=b5ad61690507e5f3f0828724e20c4f30', likes: 12, category: '学习', date: '2025-05-30' },
  { id: '6', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=students%20reading%20books&sign=055ecd056a0f2ea1094a1468d9fe794d', likes: 18, category: '学习', date: '2025-05-28' },
];

// 照片分类
const categories = ['全部', '活动', '学习', '日常'];

export default function Gallery() {
  const { isAuthenticated, user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos.slice(0, 6));
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loadingMore, setLoadingMore] = useState(false);

  // 处理点赞
  const handleLike = (id: string) => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, likes: photo.likes + 1 } : photo
    ));
  };

  // 加载更多照片
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPhotos([...photos, ...mockPhotos.slice(photos.length, photos.length + 3)]);
      setLoadingMore(false);
    }, 800);
  };

  // 过滤照片按分类
  const filteredPhotos = selectedCategory === '全部' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
      {/* 顶部导航栏 - 复用首页样式 */}
      <header className="bg-[#06AED5] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-school text-2xl"></i>
            <h1 className="text-xl font-bold">快乐班级</h1>
          </div>
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span>你好, {user?.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#06AED5] text-center">班级相册</h1>
        
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${selectedCategory === category 
                ? 'bg-[#06AED5] text-white' 
                : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 老师专属管理按钮 */}
        {isAuthenticated && user?.type === 'teacher' && (
          <div className="mb-6">
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all">
              <i className="fa-solid fa-cog mr-2"></i>
              管理分类
            </button>
          </div>
        )}

        {/* 照片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filteredPhotos.map(photo => (
            <div 
              key={photo.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={photo.url} 
                alt="班级照片" 
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => toast('即将展示照片详情')}
              />
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{photo.category} · {photo.date}</span>
                  <button 
                    onClick={() => handleLike(photo.id)}
                    className="flex items-center space-x-1 group"
                  >
                    <i className={`fa-heart ${photo.likes > 0 ? 'fa-solid text-red-500' : 'fa-regular'} 
                      group-hover:scale-125 transition-transform duration-300`}></i>
                    <span>{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        {photos.length < mockPhotos.length && (
          <div className="text-center mb-8">
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-[#FFD166] hover:bg-[#ffc233] text-gray-800 px-6 py-2 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {loadingMore ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </main>

      {/* 底部版权 - 复用首页样式 */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 快乐班级 - 小学互动平台</p>
      </footer>
    </div>
  );
}
