import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 通知数据类型
type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
};

// 课程表数据类型
type Schedule = {
  week: number;
  days: {
    day: string;
    lessons: string[];
  }[];
};

// 模拟通知数据
const mockNotices: Notice[] = [
  {
    id: '1',
    title: '家长会通知',
    content: '本周五下午2点召开家长会，请各位家长准时参加。',
    date: '2025-06-09'
  },
  {
    id: '2',
    title: '期末考试安排',
    content: '期末考试将于6月25日-6月27日进行，请同学们做好准备。',
    date: '2025-06-05'
  },
  {
    id: '3',
    title: '校园开放日',
    content: '下周三为校园开放日，欢迎家长来校参观。',
    date: '2025-06-01'
  }
];

// 模拟课程表数据
const mockSchedule: Schedule = {
  week: 15,
  days: [
    {
      day: '周一',
      lessons: ['语文', '数学', '英语', '体育']
    },
    {
      day: '周二',
      lessons: ['数学', '美术', '音乐', '科学']
    },
    {
      day: '周三',
      lessons: ['英语', '语文', '体育', '品德']
    },
    {
      day: '周四',
      lessons: ['数学', '语文', '音乐', '美术']
    },
    {
      day: '周五',
      lessons: ['英语', '数学', '班会', '科学']
    }
  ]
};

export default function NoticePage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
      {/* 顶部导航栏 - 复用首页样式 */}
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
            <div className="text-white">请先登录</div>
          )}
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-[#06AED5] text-center">班级公告栏</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 通知列表 - 左侧 */}
          <section className="lg:w-1/2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <i className="fa-solid fa-bullhorn text-2xl text-[#06AED5] mr-3"></i>
              <h2 className="text-2xl font-bold text-[#06AED5]">班级通知</h2>
            </div>
            
            <div className="space-y-4">
              {mockNotices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(notice => (
                <div key={notice.id} className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{notice.title}</h3>
                  <p className="text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-gray-400 text-sm mt-2">{notice.date}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 课程表 - 右侧 */}
          <section className="lg:w-1/2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <i className="fa-solid fa-calendar-days text-2xl text-[#FFD166] mr-3"></i>
              <h2 className="text-2xl font-bold text-[#FFD166]">本周课程表</h2>
            </div>
            
            <div className="mb-4">
              <span className="bg-[#06AED5] text-white px-3 py-1 rounded-full text-sm">
                第{mockSchedule.week}周
              </span>
            </div>
            
            <div className="space-y-3">
              {mockSchedule.days.map((day, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <h3 className="font-semibold text-gray-800">{day.day}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {day.lessons.map((lesson, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">
                        {lesson}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 底部版权 - 复用首页样式 */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 快乐班级 - 小学互动平台</p>
      </footer>
    </div>
  );
}
