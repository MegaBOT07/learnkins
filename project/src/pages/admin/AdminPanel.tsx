import { useEffect, useState } from "react";
import api, { authAPI, materialAPI, quizAPI, userAPI } from "../../utils/api";

const AdminPanel = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Quiz builder state
  const [quiz, setQuiz] = useState<any>({
    title: "",
    description: "",
    subject: "science",
    difficulty: "Medium",
    timeLimit: 30,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    points: 1,
    type: "multiple-choice",
  });

  // Data lists
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, qRes, uRes] = await Promise.all([
        materialAPI.getMaterials(),
        quizAPI.getQuizzes(),
        userAPI.getUsers(),
      ]);

      setMaterials(mRes.data?.data || mRes.data || []);
      setQuizzes(qRes.data?.data || qRes.data || []);
      setUsers(uRes.data?.data || uRes.data || []);
    } catch (err) {
      console.error("Fetch admin data failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return alert("Choose a file first");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("title", videoFile.name);
      formData.append("type", "video");

      const res = await api.post("/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data?.message || "Upload successful");
      setVideoFile(null);
      fetchAll();
      const input = document.getElementById("video-input") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addQuestion = () => {
    setQuiz((q: any) => ({ ...q, questions: [...q.questions, currentQuestion] }));
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctIndex: 0, points: 1, type: "multiple-choice" });
  };

  const createQuiz = async () => {
    try {
      if (!quiz.title.trim()) return alert("Quiz title is required");
      const payload = {
        ...quiz,
        questions: quiz.questions.map((q: any) => ({
          question: q.question,
          type: q.type || "multiple-choice",
          options: q.options.map((opt: string, idx: number) => ({ text: opt, isCorrect: idx === q.correctIndex })),
          points: q.points || 1,
        })),
        totalPoints: quiz.questions.reduce((s: number, q: any) => s + (q.points || 1), 0),
      };

      const res = await quizAPI.createQuiz(payload);
      alert(res.data?.message || "Quiz created");
      setQuiz({ title: "", description: "", subject: "science", difficulty: "Medium", timeLimit: 30, questions: [] });
      fetchAll();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Quiz creation failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await authAPI.login(loginForm);
      const tokenValue = res.data?.data?.token || res.data?.token || res.data?.accessToken;
      if (!tokenValue) return alert("Login failed: no token returned");
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
      alert("Logged in");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMaterials([]);
    setQuizzes([]);
    setUsers([]);
  };

  const promoteUser = async (userId: string, role: string) => {
    try {
      await userAPI.updateUser(userId, { role });
      alert("User updated");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await api.delete(`/materials/${id}`);
      alert("Material deleted");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      await quizAPI.deleteQuiz(id);
      alert("Quiz deleted");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {!token && (
        <section className="bg-white p-6 rounded-lg shadow mb-6 max-w-md">
          <h2 className="font-semibold mb-3">Admin Login</h2>
          <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded mb-2" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded mb-2" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          <div className="flex space-x-2">
            <button type="button" onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
          </div>
        </section>
      )}

      {token && (
        <>
          <div className="flex justify-end mb-4">
            <button type="button" onClick={logout} className="px-3 py-1 border rounded">Logout</button>
          </div>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-3">Upload Video / Material</h2>
            <input id="video-input" type="file" accept="video/*,application/*" onChange={handleFileChange} />
            <div className="mt-4">
              <button type="button" onClick={uploadVideo} disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-3">Create Quiz</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Title" className="w-full px-3 py-2 border rounded" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
              <textarea placeholder="Description" className="w-full px-3 py-2 border rounded" value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <select value={quiz.subject} onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })} className="px-3 py-2 border rounded">
                  <option value="science">Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="social-science">Social Science</option>
                </select>
                <select value={quiz.difficulty} onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })} className="px-3 py-2 border rounded">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <input type="number" value={quiz.timeLimit} onChange={(e) => setQuiz({ ...quiz, timeLimit: Number(e.target.value) })} className="px-3 py-2 border rounded" />
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Add Question</h3>
                <input type="text" placeholder="Question text" className="w-full px-3 py-2 border rounded mb-2" value={currentQuestion.question} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} />
                <div className="grid grid-cols-1 gap-2">
                  {currentQuestion.options.map((opt: string, idx: number) => (
                    <input key={idx} type="text" placeholder={`Option ${idx + 1}`} className="w-full px-3 py-2 border rounded" value={opt} onChange={(e) => setCurrentQuestion({ ...currentQuestion, options: currentQuestion.options.map((o: string, i: number) => (i === idx ? e.target.value : o)) })} />
                  ))}
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <label className="text-sm">Correct option index:</label>
                  <select value={currentQuestion.correctIndex} onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctIndex: Number(e.target.value) })} className="px-2 py-1 border rounded">
                    <option value={0}>1</option>
                    <option value={1}>2</option>
                    <option value={2}>3</option>
                    <option value={3}>4</option>
                  </select>
                  <input type="number" value={currentQuestion.points} onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })} className="w-20 px-2 py-1 border rounded" />
                  <button type="button" onClick={addQuestion} className="px-3 py-1 bg-green-600 text-white rounded">Add Question</button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Questions preview ({quiz.questions.length})</h4>
                <ol className="list-decimal ml-6">
                  {quiz.questions.map((q: any, i: number) => (
                    <li key={i} className="mb-2">
                      <div>{q.question}</div>
                      <div className="text-sm text-gray-600">Options: {q.options.join(", ")}</div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex space-x-3">
                <button type="button" onClick={createQuiz} className="px-4 py-2 bg-blue-600 text-white rounded">Create Quiz</button>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-3">Materials ({materials.length})</h2>
            {loading ? <div>Loading...</div> : (
              <div className="space-y-2">
                {materials.map((m) => (
                  <div key={m._id || m.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{m.title || m.name || m.fileName}</div>
                      <div className="text-sm text-gray-600">{m.subject || m.category || m.type}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => deleteMaterial(m._id || m.id)} className="px-2 py-1 border rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-3">Quizzes ({quizzes.length})</h2>
            {loading ? <div>Loading...</div> : (
              <div className="space-y-2">
                {quizzes.map((q) => (
                  <div key={q._id || q.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{q.title}</div>
                      <div className="text-sm text-gray-600">{q.subject} — {q.grade || q.chapter || ''}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => deleteQuiz(q._id || q.id)} className="px-2 py-1 border rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-3">Users ({users.length})</h2>
            {loading ? <div>Loading...</div> : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u._id || u.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{u.name} — {u.email}</div>
                      <div className="text-sm text-gray-600">Role: {u.role}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select value={u.role} onChange={(e) => promoteUser(u._id || u.id, e.target.value)} className="px-2 py-1 border rounded text-sm">
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
