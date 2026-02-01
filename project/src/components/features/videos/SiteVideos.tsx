import React from "react";
import { Play } from "lucide-react";
import { useTokens } from "../../../context/TokenContext";
import { progressAPI } from "../../../utils/api";

const SiteVideos: React.FC = () => {
  const videos = [
    { id: "maths", title: "Maths Lesson", src: "/maths-video.mp4" },
    { id: "science", title: "Science Lesson", src: "/science-video.mp4" },
  ];

  const { award } = useTokens();

  const handleEnded = async (title: string, duration: number) => {
    try {
      // Log video progress to backend
      await progressAPI.logVideoProgress({
        subject: "featured",
        chapter: "site-videos",
        videoId: title,
        videoTitle: title,
        timeWatched: duration,
        totalDuration: duration,
        isCompleted: true
      });
    } catch (error) {
      console.error("Error logging video progress:", error);
    }

    // Award 5 tokens for watching a video to completion
    award(5, `watched:${title}`, { videoTitle: title });
    // lightweight feedback
    try { console.log(`Awarded 5 tokens for watching ${title}`); } catch(e){}
  };

  const handlePlay = (id: string, title: string) => {
    // small award for starting a video
    award(1, `play:${title}`, { videoId: id, videoTitle: title });
  };

  return (
    <div className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 bg-black">
                <video
                  src={v.src}
                  controls
                  className="w-full h-full object-cover"
                  onPlay={() => handlePlay(v.id, v.title)}
                  onEnded={(e) => handleEnded(v.title, e.currentTarget.duration)}
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{v.title}</div>
                </div>
                <div className="text-gray-500">
                  <Play className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteVideos;
