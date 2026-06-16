import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, ArrowRight, CheckCircle } from "lucide-react";
import { materialAPI, progressAPI } from "../../utils/api";

type VideoEntry = {
  id: string;
  title: string;
  src: string;
  description?: string;
};

const VideoPage: React.FC = () => {
  const { slug, chapterId } = useParams();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>({});
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;
    const fetchVideos = async () => {
      try {
        if (slug) {
          const res = await materialAPI.getMaterials(slug);
          const items = res.data?.data || res.data || [];
          const vids: VideoEntry[] = (items || [])
            .filter((m: any) => m.type === "video")
            .map((m: any) => ({
              id: m._id || m.id || String(m.title || Math.random()),
              title: m.title || m.name || "Video",
              src:
                m.url || m.filePath || m.videoUrl || m.path || m.publicUrl || m.fileUrl || m.filename || m.src || "",
              description: m.description || m.summary || "",
            }))
            .filter((v) => v.src);

          if (mounted && vids.length > 0) {
            setVideos(vids);
            return;
          }
        }
      } catch (err) {
        console.warn("materialAPI.getMaterials failed", err);
      }

      try {
        const all = JSON.parse(localStorage.getItem("learnkins_local_videos") || "{}");
        const list: VideoEntry[] = all[slug as string] || [];
        if (mounted) setVideos(list);
      } catch (e) {
        if (mounted) setVideos([]);
      }
    };

    fetchVideos();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleVideoTimeUpdate = async (videoId: string, currentTime: number, duration: number) => {
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: currentTime
    }));
  };

  const handleVideoEnded = async (videoId: string, video: VideoEntry, duration: number) => {
    try {
      await progressAPI.logVideoProgress({
        subject: slug,
        chapter: chapterId || "general",
        videoId,
        videoTitle: video.title,
        timeWatched: duration,
        totalDuration: duration,
        isCompleted: true
      });

      setWatchedVideos(prev => ({
        ...prev,
        [videoId]: true
      }));

      console.log(`Video "${video.title}" progress saved`);
    } catch (error) {
      console.error("Error logging video progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-2 text-sm font-bold mb-4">
            <Link to="/subjects" className="hover:text-green-400 transition-colors">
              Subjects
            </Link>
            <ArrowRight className="h-4 w-4" />
            <Link to={`/subjects/${slug}`} className="hover:text-green-400 transition-colors">
              {slug}
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-green-400">Videos</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border-2 border-green-500 rounded-full mb-4">
            <Play className="h-5 w-5 text-green-400 mr-2" />
            <span className="font-bold text-green-400 text-sm uppercase tracking-wider">Video Lessons</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Video Lessons</h1>
          <p className="text-gray-300 mt-2 font-medium">Videos for this subject and chapter.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-black font-bold mb-2">
                No local videos found for this subject.
              </p>
              <p className="text-gray-600 font-medium text-sm mb-4">
                Add videos from the subject page (Video tab) or place files in the `public/` folder
                and register them under the subject via the Subject Detail Video form.
              </p>
              <Link to={`/subjects/${slug}`} className="inline-flex items-center text-black font-black underline underline-offset-2 hover:text-green-600 transition-colors">
                Open subject videos tab
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:-translate-y-1 transition-all">
                  <div className="bg-black flex items-center justify-center h-48 relative">
                    <Play className="h-16 w-16 text-white opacity-60" />
                    {watchedVideos[v.id] && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center border-2 border-black">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Watched
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="font-black text-black text-lg">{v.title}</div>
                    {v.description && <div className="text-sm text-gray-600 font-medium mt-1">{v.description}</div>}
                    <div className="mt-4">
                      <video
                        controls
                        src={v.src}
                        className="w-full h-48 rounded-xl border-2 border-gray-200"
                        onTimeUpdate={(e) => handleVideoTimeUpdate(v.id, e.currentTime, e.currentTarget.duration)}
                        onEnded={(e) => handleVideoEnded(v.id, v, e.currentTarget.duration)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideoPage;
