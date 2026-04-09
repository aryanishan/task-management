"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Sun, Moon, Plus, Trash2, CheckCircle2, Circle, 
  Calendar, Tag, LayoutList 
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  category: string | null;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const API_URL = "http://localhost:5000/api/tasks";

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch {
      showError("Failed to load tasks");
    }
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      dueDate: fd.get("dueDate") as string,
      category: fd.get("category") as string,
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      (e.target as HTMLFormElement).reset();
      fetchTasks();
    } catch {
      showError("Could not add task. Check title.");
    }
  };

  const completeTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}/complete`, { method: "PATCH" });
      fetchTasks();
    } catch {
      showError("Failed to complete task.");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch {
      showError("Failed to delete task.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 font-sans">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
             <LayoutList size={20} />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Tasks</h1>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        
        {/* Main Task List */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">Your Tasks</h2>
          
          <div className="flex flex-col gap-3">
            {tasks.length === 0 ? (
               <div className="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500">
                 No tasks pending. You're all caught up!
               </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group flex items-start gap-4 p-4 rounded-xl border ${task.completed ? 'border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm'} transition-all hover:border-blue-300 dark:hover:border-blue-800`}
                >
                  <button 
                    disabled={task.completed}
                    onClick={() => completeTask(task.id)}
                    className={`mt-0.5 shrink-0 ${task.completed ? 'text-zinc-400 dark:text-zinc-600 cursor-default' : 'text-zinc-300 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition-colors'}`}
                  >
                    {task.completed ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Circle size={22} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-medium ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-800 dark:text-zinc-100'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className={`mt-1 text-sm ${task.completed ? 'text-zinc-400 dark:text-zinc-600 line-through' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                       {task.dueDate && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                           <Calendar size={12} />
                           {task.dueDate}
                         </span>
                       )}
                       {task.category && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                           <Tag size={12} />
                           {task.category}
                         </span>
                       )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sidebar Creation Form */}
        <aside>
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 sticky top-10">
            <h3 className="text-sm font-semibold mb-4 text-zinc-800 dark:text-zinc-200">New Task</h3>
            
            {errorMsg && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50">
                {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div>
                <label className="sr-only">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="Task title..."
                  required
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="sr-only">Description</label>
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Due Date</label>
                  <input
                    name="dueDate"
                    type="date"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div>
                   <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
                  <input
                    name="category"
                    type="text"
                    placeholder="e.g. Work"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 w-full flex justify-center items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2 px-4 rounded-lg transition-all"
              >
                <Plus size={16} />
                Create Task
              </button>
            </form>
          </div>
        </aside>

      </div>
    </div>
  );
}
