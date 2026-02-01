import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play } from "lucide-react";
import { materialAPI, progressAPI } from "../../utils/api";

type VideoEntry = {
  id: string;
  title: string;
  src: string; // path relative to public, e.g. /maths-video.mp4
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
      // Try server first
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
        // ignore and fall back to localStorage
        console.warn("materialAPI.getMaterials failed", err);
      }

      // Fallback to localStorage mapping
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
    // Update local progress
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: currentTime
    }));
  };

  const handleVideoEnded = async (videoId: string, video: VideoEntry, duration: number) => {
    try {
      // Log video completion
      await progressAPI.logVideoProgress({
        subject: slug,
        chapter: chapterId || "general",
        videoId,
        videoTitle: video.title,
        timeWatched: duration,
        totalDuration: duration,
        isCompleted: true
      });

      // Mark as watched
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Link to="/subjects" className="text-blue-600 hover:underline">
              Subjects
            </Link>
            <span>/</span>
            <Link to={`/subjects/${slug}`} className="text-blue-600 hover:underline">
              {slug}
            </Link>
            <span>/</span>
            <span className="font-medium">Videos</span>
          </div>
          <h1 className="text-3xl font-bold mt-4">Video Lessons</h1>
          <p className="text-gray-600 mt-2">Videos for this subject and chapter.</p>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">
              No local videos found for this subject. Add videos from the
              subject page (Video tab) or place files in the `public/` folder
              and register them under the subject via the Subject Detail Video
              form.
            </p>
            <div className="mt-4">
              <Link to={`/subjects/${slug}`} className="text-blue-600 hover:underline">
                Open subject videos tab
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div key={v.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-900 flex items-center justify-center h-48 relative">
                  <Play className="h-20 w-20 text-white opacity-80" />
                  {watchedVideos[v.id] && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ✓ Watched
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium text-gray-900">{v.title}</div>
                  {v.description && <div className="text-sm text-gray-600">{v.description}</div>}
                  <div className="mt-3">
                    <video
                      controls
                      src={v.src}
                      className="w-full h-48 rounded"
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
    </div>
  );
};

export default VideoPage;
