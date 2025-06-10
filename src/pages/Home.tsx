import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // 新增

// 公告数据
const topNotice = {
  title: '家长会通知',
  content: '本周五下午2点召开家长会，请各位家长准时参加。',
  date: '2025-06-09'
};

// 照片数据类型
type Photo = {
  id: string;
  url: string;
  likes: number;
  date: string;
};

// 模拟照片数据
const mockPhotos: Photo[] = [
  { id: '1', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=happy%20students%20in%20classroom&sign=9b7b349a2ecb8ac884bf4d8e48051640', likes: 15, date: '2025-06-08' },
  { id: '2', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=school%20sports%20day&sign=a02f47bffe4bb67e6a5b4b27a8614d07', likes: 23, date: '2025-06-07' },
  { id: '3', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20class%20exhibition&sign=f3a5d399438793aa8b7a86d0709915dd', likes: 8, date: '2025-06-06' },
  { id: '4', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=teacher%20with%20students&sign=90b9bf20e8f22a16b8f764503f46157f', likes: 32, date: '2025-06-01' },
  { id: '5', url: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=school%20library&sign=b5ad61690507e5f3f0828724e20c4f30', likes: 12, date: '2025-05-30' },
];

export default function Home() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate(); // 新增

  // 获取验证码
  const getCode = () => {
    if (!phone) {
      toast.error('请输入手机号');
      return;
    }
    setShowCodeInput(true);
    toast.success('验证码已发送');
  };

  // 处理登录
  const handleLogin = () => {
    if (!code) {
      toast.error('请输入验证码');
      return;
    }
    // 模拟登录成功
    const userType = Math.random() > 0.7 ? 'teacher' : (Math.random() > 0.5 ? 'parent' : 'student');
    login({ type: userType, name: userType === 'teacher' ? '张老师' : userType === 'parent' ? '王家长' : '李同学' });
    toast.success('登录成功');
  };

  // 最新3张照片
  const latestPhotos = mockPhotos.slice(0, 3);
  // 历史2张照片
  const historyPhotos = mockPhotos.slice(3, 5);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
      {/* 公告栏置顶 */}
      <div className="w-full bg-yellow-100 border-b border-yellow-300 py-2 px-4 flex items-center justify-center sticky top-0 z-30">
        <i className="fa-solid fa-bullhorn text-yellow-500 mr-2"></i>
        <span className="font-bold text-yellow-700 mr-2">{topNotice.title}：</span>
        <span className="text-yellow-700">{topNotice.content}</span>
        <span className="ml-4 text-xs text-yellow-500">{topNotice.date}</span>
      </div>

      {/* 顶部导航栏 */}
      <header className="bg-[#06AED5] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-school text-2xl"></i>
            <h1 className="text-xl font-bold">快乐班级</h1>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span>你好, {user?.name}</span>
              <button 
                onClick={logout}
                className="bg-[#FFD166] hover:bg-[#ffc233] text-gray-800 px-4 py-1 rounded transition-all active:scale-95"
              >
                退出
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <input
                type="tel"
                placeholder="手机号"
                className="px-3 py-1 rounded text-gray-800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {!showCodeInput ? (
                <button 
                  onClick={getCode}
                  className="bg-[#FFD166] hover:bg-[#ffc233] text-gray-800 px-4 py-1 rounded transition-all active:scale-95"
                >
                  获取验证码
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="验证码"
                    className="px-3 py-1 rounded text-gray-800"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button 
                    onClick={handleLogin}
                    className="bg-[#FFD166] hover:bg-[#ffc233] text-gray-800 px-4 py-1 rounded transition-all active:scale-95"
                  >
                    登录
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow container mx-auto p-4">
        {/* 照片瀑布流 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#06AED5]">班级相册</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestPhotos.map((photo) => (
              <div 
                key={photo.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/gallery')} // 修改：点击跳转
              >
                <img src={photo.url} alt="班级照片" className="w-full h-48 object-cover" />
                <div className="p-3 flex justify-between items-center">
                  <span className="text-gray-500">{photo.date}</span>
                  <div className="flex items-center space-x-1">
                    <i className="fa-solid fa-heart text-red-500"></i>
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-4 text-[#FFD166]">历史照片</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyPhotos.map((photo) => (
              <div 
                key={photo.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/gallery')} // 修改：点击跳转
              >
                <img src={photo.url} alt="班级照片" className="w-full h-48 object-cover" />
                <div className="p-3 flex justify-between items-center">
                  <span className="text-gray-500">{photo.date}</span>
                  <div className="flex items-center space-x-1">
                    <i className="fa-solid fa-heart text-red-500"></i>
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 资料入口 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#06AED5]">资料中心</h2>
          {isAuthenticated ? (
            user?.type === 'teacher' ? (
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-all active:scale-95">
                <i className="fa-solid fa-upload mr-2"></i>
                上传资料
              </button>
            ) : (
              <button className="bg-[#06AED5] hover:bg-[#0599c0] text-white px-6 py-3 rounded-lg shadow-md transition-all active:scale-95">
                <i className="fa-solid fa-download mr-2"></i>
                下载资料
              </button>
            )
          ) : (
            <div className="text-gray-500">登录后查看资料</div>
          )}
        </section>
      </main>

      {/* 底部版权 */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 快乐班级 - 小学互动平台</p>
      </footer>
    </div>
  );
}