import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { groq } from "../integrations/chatbot/client";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  PlusCircle,
  Edit,
  Trash2,
  Sparkles,
  Bot,
  Send,
  Image as ImageIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  ExternalLink,
  Hash,
  TrendingUp,
  Zap,
  Palette,
  Target,
  Lightbulb,
  Filter,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  subscribeToPosts,
  subscribeToLikes,
  getAIAnalytics,
  trackPostEngagement,
  type Post as SupabasePost,
  type AIGenerationOptions,
} from "@/lib/supabase-posts";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Social() {
  const [posts, setPosts] = useState<SupabasePost[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SupabasePost | null>(null);
  const [newPost, setNewPost] = useState({
    content: "",
    image_url: "",
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [aiOptions, setAiOptions] = useState<AIGenerationOptions>({
    tone: "professional",
    includeHashtags: true,
    optimizeForEngagement: true,
    targetAudience: "patients",
    brandVoice: "friendly",
    contentType: "tip",
  });

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const postsData = await getPosts(user?.id);
      setPosts(postsData);
      setIsLoading(false);
    };

    loadPosts();
  }, [user]);

  // Reload posts when user changes (for like status)
  useEffect(() => {
    if (user) {
      const loadPosts = async () => {
        const postsData = await getPosts(user.id);
        setPosts(postsData);
      };
      loadPosts();
    }
  }, [user]);

  // Simple polling approach for now
  useEffect(() => {
    const interval = setInterval(async () => {
      if (posts.length > 0) {
        const postsData = await getPosts(user?.id);
        setPosts(postsData);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user?.id, posts.length]);

  // Filter posts based on search and filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "ai" && post.is_generated_by_ai) ||
      (selectedFilter === "my" && post.user_id === user?.id);
    return matchesSearch && matchesFilter;
  });

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    const postData = {
      content: newPost.content,
      image_url: newPost.image_url || undefined,
      is_generated_by_ai: newPost.content.includes("✨"),
      ai_prompt: newPost.content.includes("✨")
        ? "AI enhanced content"
        : undefined,
      ai_generation_options: newPost.content.includes("✨")
        ? aiOptions
        : undefined,
    };

    // send post to n8n with enhanced payload
    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": "1.0.0",
          "X-Event-Timestamp": new Date().toISOString(),
        },
        body: JSON.stringify({
          event: "post.created",
          timestamp: new Date().toISOString(),
          source: "dent-app-social",
          post: postData,
          context: {
            user_agent: navigator.userAgent,
            platform: "web",
            app_version: "1.0.0",
          },
        }),
      });
      console.log("✅ Webhook sent successfully to n8n");
      toast.success("🚀 Post synced with automation system!", {
        description:
          "Your post has been sent to n8n for AI analysis and processing",
        duration: 4000,
      });
    } catch (error) {
      console.error("❌ Failed to send webhook to n8n:", error);
      // Don't fail the post creation if webhook fails
      toast.error("Post created but failed to sync with automation system");
    }

    //TBD: fix DB integration

    // const createdPost = await createPost(postData);

    // if (createdPost) {
    //   // Add the new post to the beginning of the list immediately
    //   setPosts((prev) => [createdPost, ...prev]);
    //   setNewPost({ content: "", image_url: "" });
    //   setIsCreateDialogOpen(false);
    //   toast.success("Post created successfully!");

    //   // Also refresh posts from server to ensure consistency
    //   setTimeout(async () => {
    //     const postsData = await getPosts(user?.id);
    //     setPosts(postsData);
    //   }, 1000);
    // }
  };

  const handleEditPost = async () => {
    if (!editingPost || !newPost.content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    const postData = {
      content: newPost.content,
      image_url: newPost.image_url || undefined,
      is_generated_by_ai: newPost.content.includes("✨"),
      ai_prompt: newPost.content.includes("✨")
        ? "AI enhanced content"
        : undefined,
      ai_generation_options: newPost.content.includes("✨")
        ? aiOptions
        : undefined,
    };

    const updatedPost = await updatePost(editingPost.id, postData);

    if (updatedPost) {
      setEditingPost(null);
      setNewPost({ content: "", image_url: "" });
      setIsEditDialogOpen(false);
      toast.success("Post updated successfully!");
      // send post update to n8n with enhanced payload
      try {
        const webhookUrl =
          import.meta.env.VITE_USE_CORS_PROXY === "true"
            ? `https://cors-anywhere.herokuapp.com/${
                import.meta.env.VITE_N8N_WEBHOOK_URL
              }`
            : import.meta.env.VITE_N8N_WEBHOOK_URL;

        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Version": "1.0.0",
            "X-Event-Timestamp": new Date().toISOString(),
          },
          body: JSON.stringify({
            event: "post.updated",
            timestamp: new Date().toISOString(),
            source: "dent-app-social",
            post: updatedPost,
            context: {
              user_agent: navigator.userAgent,
              platform: "web",
              app_version: "1.0.0",
              update_reason: "content_modification",
            },
          }),
        });
        console.log("✅ Post update webhook sent successfully to n8n");
        toast.success("🔄 Post update synced with automation system!", {
          description:
            "Your post changes have been sent to n8n for re-analysis",
          duration: 4000,
        });
      } catch (error) {
        console.error("❌ Failed to send post update webhook to n8n:", error);
        toast.error("Post updated but failed to sync with automation system");
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);
    if (success) {
      // Remove the post from local state immediately
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  const handleLikePost = async (postId: string) => {
    const success = await toggleLike(postId);
    if (success) {
      // Track engagement metrics
      await trackPostEngagement(postId, "view");
      // send like event to n8n with enhanced payload
      try {
        const postData = posts.find((p) => p.id === postId);
        const webhookUrl =
          import.meta.env.VITE_USE_CORS_PROXY === "true"
            ? `https://cors-anywhere.herokuapp.com/${
                import.meta.env.VITE_N8N_WEBHOOK_URL
              }`
            : import.meta.env.VITE_N8N_WEBHOOK_URL;

        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Version": "1.0.0",
            "X-Event-Timestamp": new Date().toISOString(),
          },
          body: JSON.stringify({
            event: "post.liked",
            timestamp: new Date().toISOString(),
            source: "dent-app-social",
            postId: postId,
            post: postData
              ? {
                  content: postData.content,
                  user_name: postData.user_name,
                  is_generated_by_ai: postData.is_generated_by_ai,
                  likes_count: postData.likes_count,
                  engagement_metrics: postData.engagement_metrics,
                }
              : null,
            context: {
              user_agent: navigator.userAgent,
              platform: "web",
              app_version: "1.0.0",
              engagement_type: "like",
            },
          }),
        });
        console.log("✅ Like webhook sent successfully to n8n");
        toast.success("👍 Like synced with automation system!", {
          description: "Engagement data sent to n8n for analytics processing",
          duration: 3000,
        });
      } catch (error) {
        console.error("❌ Failed to send like webhook to n8n:", error);
        toast.error("Failed to sync like with automation system");
      }
      // Update like status immediately
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: post.is_liked
                ? post.likes_count - 1
                : post.likes_count + 1,
              is_liked: !post.is_liked,
            };
          }
          return post;
        })
      );
    }
  };

  // Enhanced AI content generation with multiple options
  const generateAIContent = async (
    prompt: string,
    options: AIGenerationOptions
  ) => {
    const systemPrompt = `You are a dental health content specialist. Create engaging, informative content based on the user's input.

Tone: ${options.tone}
Target Audience: ${options.targetAudience}
Include Hashtags: ${options.includeHashtags ? "Yes" : "No"}
Optimize for Engagement: ${options.optimizeForEngagement ? "Yes" : "No"}

Guidelines:
- Use appropriate emojis and formatting
- Make content engaging and shareable
- Include relevant dental health tips when appropriate
- Use hashtags like #DentalHealth #OralCare #DentForOne if requested
- Keep tone professional but approachable
- Add sparkle emoji (✨) at the beginning to indicate AI enhancement

Create content that will resonate with the target audience and encourage engagement.`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 300,
      });

      return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating AI content:", error);
      throw error;
    }
  };

  // Generate content from scratch
  const handleGenerateFromScratch = async () => {
    setIsGeneratingAI(true);
    toast.info("AI is creating content for you...");

    try {
      const content = await generateAIContent(
        "Create an engaging dental health post that would be interesting to share on social media",
        aiOptions
      );

      setNewPost({
        ...newPost,
        content: content,
      });

      toast.success("AI has created content for you!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Improve existing content
  const handleUseAIToFix = async () => {
    if (!newPost.content.trim()) {
      toast.error("Please enter some content first");
      return;
    }

    setIsGeneratingAI(true);
    toast.info("AI is improving your content...");

    try {
      const improvedContent = await generateAIContent(
        `Improve this dental health post: "${newPost.content}"`,
        aiOptions
      );

      setNewPost({
        ...newPost,
        content: improvedContent,
      });

      toast.success("AI has improved your content!");
    } catch (error) {
      toast.error("Failed to improve content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Generate hashtag suggestions
  const handleGenerateHashtags = async () => {
    setIsGeneratingAI(true);
    toast.info("AI is generating hashtag suggestions...");

    try {
      const hashtags = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Generate 5-8 relevant hashtags for dental health content. Return only the hashtags separated by spaces, no additional text.",
          },
          { role: "user", content: newPost.content || "dental health post" },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 100,
      });

      const hashtagText = hashtags.choices[0]?.message?.content || "";
      setNewPost({
        ...newPost,
        content: newPost.content + "\n\n" + hashtagText,
      });

      toast.success("Hashtags added!");
    } catch (error) {
      toast.error("Failed to generate hashtags. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Optimize post for specific platform
  const handleOptimizeForPlatform = async (platform: string) => {
    if (!newPost.content.trim()) {
      toast.error("Please enter some content first");
      return;
    }

    setIsGeneratingAI(true);
    toast.info(`AI is optimizing for ${platform}...`);

    try {
      const optimizedContent = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Optimize this dental health post for ${platform}. Consider platform-specific best practices, character limits, and engagement patterns. Keep the original message but adapt it for ${platform} users.`,
          },
          { role: "user", content: newPost.content },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 200,
      });

      setNewPost({
        ...newPost,
        content:
          optimizedContent.choices[0]?.message?.content || newPost.content,
      });

      toast.success(`Content optimized for ${platform}!`);
    } catch (error) {
      toast.error("Failed to optimize content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Enhanced AI-Powered Content Creation with Professional Tone Control
  const handleGenerateProfessionalContent = async () => {
    setIsGeneratingAI(true);
    toast.info("AI is creating professional content...");

    try {
      const professionalPrompt = `Create a professional dental health post with the following specifications:
- Tone: ${aiOptions.tone}
- Brand Voice: ${aiOptions.brandVoice}
- Content Type: ${aiOptions.contentType}
- Target Audience: ${aiOptions.targetAudience}
- Include trending hashtags: ${aiOptions.includeHashtags ? "Yes" : "No"}
- Optimize for engagement: ${aiOptions.optimizeForEngagement ? "Yes" : "No"}

Create content that maintains consistent brand voice and professional standards while being engaging and informative.`;

      const content = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional dental health content creator. Create engaging, informative, and professional content that maintains consistent brand voice and follows dental industry best practices. Always start with ✨ to indicate AI enhancement.",
          },
          { role: "user", content: professionalPrompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 400,
      });

      setNewPost({
        ...newPost,
        content: content.choices[0]?.message?.content || "",
      });

      toast.success("Professional content generated!");
    } catch (error) {
      toast.error("Failed to generate professional content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Smart Hashtag Suggestions with Trending Analysis
  const handleGenerateTrendingHashtags = async () => {
    setIsGeneratingAI(true);
    toast.info("AI is analyzing trending hashtags...");

    try {
      const hashtagPrompt = `Analyze the following dental health content and generate trending, relevant hashtags:
Content: "${newPost.content || "dental health post"}"

Requirements:
- Include 8-12 hashtags
- Mix trending and evergreen hashtags
- Consider dental industry trends
- Include location-based hashtags if relevant
- Optimize for maximum reach and engagement
- Return only hashtags separated by spaces, no additional text

Focus on hashtags that are currently trending in the dental health space and will maximize post visibility.`;

      const hashtags = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a social media hashtag specialist for dental health content. Generate trending, relevant hashtags that will maximize post reach and engagement.",
          },
          { role: "user", content: hashtagPrompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 150,
      });

      const hashtagText = hashtags.choices[0]?.message?.content || "";
      setNewPost({
        ...newPost,
        content: newPost.content + "\n\n" + hashtagText,
      });

      toast.success("Trending hashtags added!");
    } catch (error) {
      toast.error("Failed to generate trending hashtags. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Brand Voice Consistency Checker
  const handleCheckBrandVoice = async () => {
    if (!newPost.content.trim()) {
      toast.error("Please enter some content first");
      return;
    }

    setIsGeneratingAI(true);
    toast.info("AI is analyzing brand voice consistency...");

    try {
      const brandVoicePrompt = `Analyze the following dental health content for brand voice consistency:

Content: "${newPost.content}"

Current Brand Voice: ${aiOptions.brandVoice}
Target Tone: ${aiOptions.tone}
Target Audience: ${aiOptions.targetAudience}

Provide specific feedback on:
1. Brand voice consistency (1-10 score)
2. Tone appropriateness
3. Suggested improvements
4. Professional standards compliance

Keep feedback concise and actionable.`;

      const analysis = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a brand voice specialist for dental health content. Analyze content for consistency, professionalism, and brand alignment.",
          },
          { role: "user", content: brandVoicePrompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 200,
      });

      const feedback = analysis.choices[0]?.message?.content || "";

      // Extract score from feedback (look for "1-10 score" pattern)
      const scoreMatch = feedback.match(
        /(\d+(?:\.\d+)?)\s*\/\s*10|score[:\s]*(\d+(?:\.\d+)?)/i
      );
      if (scoreMatch) {
        const score = parseFloat(scoreMatch[1] || scoreMatch[2]);
        if (!isNaN(score) && score >= 0 && score <= 10) {
          // Note: Brand voice score is now tracked in AI metadata
          console.log(`Brand voice score: ${score}/10`);
          toast.success(`Brand voice score: ${score}/10`, {
            description: feedback,
            duration: 8000,
          });
        } else {
          toast.success("Brand voice analysis complete!", {
            description: feedback,
            duration: 8000,
          });
        }
      } else {
        toast.success("Brand voice analysis complete!", {
          description: feedback,
          duration: 8000,
        });
      }
    } catch (error) {
      toast.error("Failed to analyze brand voice. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const openEditDialog = (post: SupabasePost) => {
    setEditingPost(post);
    setNewPost({
      content: post.content,
      image_url: post.image_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSharePost = async (post: SupabasePost, platform: string) => {
    const postContent = post.content;
    const postUrl = `${window.location.origin}/social/post/${post.id}`;
    const hashtags = "#DentalHealth #OralCare #DentForOne";

    let shareUrl = "";
    let shareText = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}&quote=${encodeURIComponent(postContent)}`;
        break;
      case "twitter":
        shareText = `${postContent} ${hashtags}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(postUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          postUrl
        )}&title=${encodeURIComponent(
          "Dental Health Post"
        )}&summary=${encodeURIComponent(postContent)}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we'll copy the content
        shareText = `${postContent}\n\n${hashtags}\n\n${postUrl}`;
        navigator.clipboard.writeText(shareText);
        toast.success("Content copied! You can now paste it on Instagram");
        return;
      case "copy":
        shareText = `${postContent}\n\n${hashtags}\n\n${postUrl}`;
        navigator.clipboard.writeText(shareText);
        toast.success("Post content copied to clipboard!");
        return;
      default:
        return;
    }

    // Track engagement metrics
    await trackPostEngagement(post.id, "share");

    // send share event to n8n with enhanced payload
    try {
      const webhookUrl =
        import.meta.env.VITE_USE_CORS_PROXY === "true"
          ? `https://cors-anywhere.herokuapp.com/${
              import.meta.env.VITE_N8N_WEBHOOK_URL
            }`
          : import.meta.env.VITE_N8N_WEBHOOK_URL;

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": "1.0.0",
          "X-Event-Timestamp": new Date().toISOString(),
        },
        body: JSON.stringify({
          event: "post.shared",
          timestamp: new Date().toISOString(),
          source: "dent-app-social",
          postId: post.id,
          platform: platform,
          post: {
            content: post.content,
            user_name: post.user_name,
            is_generated_by_ai: post.is_generated_by_ai,
            shares_count: post.engagement_metrics?.shares || 0,
            engagement_metrics: post.engagement_metrics,
            ai_generation_options: post.ai_generation_options,
            ai_metadata: post.ai_metadata,
          },
          share_data: {
            share_url: shareUrl,
            share_text: shareText,
            platform_specific: true,
          },
          context: {
            user_agent: navigator.userAgent,
            platform: "web",
            app_version: "1.0.0",
            engagement_type: "share",
            target_platform: platform,
          },
        }),
      });
      console.log(`✅ Share webhook sent successfully to n8n for ${platform}`);
      toast.success(`📤 Share synced with automation system for ${platform}!`, {
        description: `Share data sent to n8n for ${platform} analytics and cross-platform optimization`,
        duration: 4000,
      });
    } catch (error) {
      console.error("❌ Failed to send share webhook to n8n:", error);
      toast.error(
        `Failed to sync share with automation system for ${platform}`
      );
    }

    // Open sharing URL in new window
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header title="Social Share" />

      <main className="container px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
              <SelectItem value="my">My Posts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* AI Analytics Dashboard */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">
              AI Content Analytics
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const analytics = await getAIAnalytics();
                  toast.success(
                    `Analytics: ${
                      analytics.totalAIPosts
                    } AI posts, Avg Engagement: ${analytics.averageEngagement.toFixed(
                      1
                    )}%`
                  );
                } catch (error) {
                  toast.error("Failed to load analytics");
                }
              }}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <TrendingUp size={14} className="mr-2" />
              View Analytics
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {posts.filter((p) => p.is_generated_by_ai).length}
              </div>
              <div className="text-xs text-blue-700">AI Generated</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-purple-600">
                {
                  posts.filter(
                    (p) =>
                      p.ai_metadata?.brand_voice_score &&
                      p.ai_metadata.brand_voice_score > 8
                  ).length
                }
              </div>
              <div className="text-xs text-purple-700">High Quality</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-green-600">
                {
                  posts.filter((p) => p.ai_generation_options?.contentType)
                    .length
                }
              </div>
              <div className="text-xs text-green-700">Categorized</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-orange-600">
                {posts.length}
              </div>
              <div className="text-xs text-orange-700">Total Posts</div>
            </div>
          </div>
        </div>

        {/* Enhanced AI Analytics Dashboard */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-900">
              AI Performance Insights
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const analytics = await getAIAnalytics();
                  const topTone =
                    analytics.topPerformingTones[0]?.tone || "N/A";
                  const topVoice =
                    analytics.topPerformingBrandVoices[0]?.voice || "N/A";
                  const topHashtag =
                    analytics.hashtagPerformance[0]?.hashtag || "N/A";

                  toast.success(
                    `Top Performers: Tone: ${topTone}, Voice: ${topVoice}, Hashtag: ${topHashtag}`,
                    { duration: 8000 }
                  );
                } catch (error) {
                  toast.error("Failed to load performance insights");
                }
              }}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <Zap size={14} className="mr-2" />
              Performance Insights
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {
                  posts.filter(
                    (p) =>
                      p.ai_metadata?.confidence_score &&
                      p.ai_metadata.confidence_score > 0.8
                  ).length
                }
              </div>
              <div className="text-xs text-green-700">High Confidence</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-emerald-600">
                {
                  posts.filter(
                    (p) =>
                      p.ai_metadata?.engagement_prediction_score &&
                      p.ai_metadata.engagement_prediction_score > 0.7
                  ).length
                }
              </div>
              <div className="text-xs text-emerald-700">High Engagement</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-teal-600">
                {
                  posts.filter(
                    (p) =>
                      p.ai_metadata?.content_quality_score &&
                      p.ai_metadata.content_quality_score > 0.85
                  ).length
                }
              </div>
              <div className="text-xs text-teal-700">Premium Quality</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-cyan-600">
                {
                  posts.filter(
                    (p) =>
                      p.ai_metadata?.hashtag_relevance_score &&
                      p.ai_metadata.hashtag_relevance_score > 0.75
                  ).length
                }
              </div>
              <div className="text-xs text-cyan-700">Relevant Hashtags</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Share Your Dental Journey</h2>
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} posts •{" "}
              {posts.filter((p) => p.is_generated_by_ai).length} AI enhanced
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your dental health journey with the community
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* AI Generation Options */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-primary" />
                    <h4 className="font-medium">AI Content Assistant</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select
                        value={aiOptions.tone}
                        onValueChange={(
                          value:
                            | "professional"
                            | "casual"
                            | "educational"
                            | "motivational"
                        ) => setAiOptions((prev) => ({ ...prev, tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="educational">
                            Educational
                          </SelectItem>
                          <SelectItem value="motivational">
                            Motivational
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select
                        value={aiOptions.targetAudience}
                        onValueChange={(
                          value: "patients" | "professionals" | "general"
                        ) =>
                          setAiOptions((prev) => ({
                            ...prev,
                            targetAudience: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patients">Patients</SelectItem>
                          <SelectItem value="professionals">
                            Professionals
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandVoice">Brand Voice</Label>
                      <Select
                        value={aiOptions.brandVoice}
                        onValueChange={(
                          value:
                            | "friendly"
                            | "authoritative"
                            | "caring"
                            | "modern"
                        ) =>
                          setAiOptions((prev) => ({
                            ...prev,
                            brandVoice: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="authoritative">
                            Authoritative
                          </SelectItem>
                          <SelectItem value="caring">Caring</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={aiOptions.contentType}
                        onValueChange={(
                          value:
                            | "tip"
                            | "story"
                            | "educational"
                            | "promotional"
                            | "community"
                        ) =>
                          setAiOptions((prev) => ({
                            ...prev,
                            contentType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tip">Tip</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="educational">
                            Educational
                          </SelectItem>
                          <SelectItem value="promotional">
                            Promotional
                          </SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hashtags"
                        checked={aiOptions.includeHashtags}
                        onCheckedChange={(checked) =>
                          setAiOptions((prev) => ({
                            ...prev,
                            includeHashtags: checked,
                          }))
                        }
                      />
                      <Label htmlFor="hashtags">Include Hashtags</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="engagement"
                        checked={aiOptions.optimizeForEngagement}
                        onCheckedChange={(checked) =>
                          setAiOptions((prev) => ({
                            ...prev,
                            optimizeForEngagement: checked,
                          }))
                        }
                      />
                      <Label htmlFor="engagement">
                        Optimize for Engagement
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Textarea
                    placeholder="What's on your mind about dental health?"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    className="min-h-[120px]"
                  />

                  {/* AI Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateProfessionalContent}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2"
                    >
                      <Target size={14} />
                      {isGeneratingAI
                        ? "Generating..."
                        : "Professional Content"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateFromScratch}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2"
                    >
                      <Lightbulb size={14} />
                      {isGeneratingAI ? "Generating..." : "Generate Content"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUseAIToFix}
                      disabled={isGeneratingAI || !newPost.content.trim()}
                      className="flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      {isGeneratingAI ? "Improving..." : "Improve Content"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateTrendingHashtags}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp size={14} />
                      {isGeneratingAI ? "Analyzing..." : "Trending Hashtags"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateHashtags}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2"
                    >
                      <Hash size={14} />
                      {isGeneratingAI ? "Generating..." : "Add Hashtags"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCheckBrandVoice}
                      disabled={isGeneratingAI || !newPost.content.trim()}
                      className="flex items-center gap-2"
                    >
                      <Palette size={14} />
                      {isGeneratingAI ? "Analyzing..." : "Check Brand Voice"}
                    </Button>
                  </div>

                  {/* Platform Optimization Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOptimizeForPlatform("Instagram")}
                      disabled={isGeneratingAI || !newPost.content.trim()}
                      className="flex items-center gap-2"
                    >
                      <Instagram size={14} />
                      Optimize for Instagram
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOptimizeForPlatform("Twitter")}
                      disabled={isGeneratingAI || !newPost.content.trim()}
                      className="flex items-center gap-2"
                    >
                      <Twitter size={14} />
                      Optimize for Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOptimizeForPlatform("LinkedIn")}
                      disabled={isGeneratingAI || !newPost.content.trim()}
                      className="flex items-center gap-2"
                    >
                      <Linkedin size={14} />
                      Optimize for LinkedIn
                    </Button>
                  </div>

                  {newPost.content.includes("✨") && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bot size={12} />
                      <span>Generated by AI</span>
                      <Badge variant="secondary" className="text-xs">
                        AI Enhanced
                      </Badge>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Image URL (optional)"
                  value={newPost.image_url}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image_url: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>Create Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || selectedFilter !== "all"
                    ? "No posts match your filters."
                    : "No posts yet. Be the first to share!"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-card rounded-xl shadow-sm overflow-hidden animate-fade-in"
                  style={{
                    animationDelay: `${parseInt(post.id.slice(0, 8)) * 100}ms`,
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img
                          src={
                            post.user_avatar ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2340&auto=format&fit=crop"
                          }
                          alt={post.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium text-sm">
                            {post.user_name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(post.created_at)}
                          </p>
                        </div>
                      </div>
                      {user && post.user_id === user.id && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>

                    {post.is_generated_by_ai && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Bot size={12} />
                        <span>Generated by AI</span>
                        {post.ai_prompt && (
                          <Badge variant="secondary" className="text-xs">
                            Prompt: "{post.ai_prompt}"
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-sm mb-3">{post.content}</p>

                    {post.image_url && (
                      <div
                        className="h-48 bg-cover bg-center rounded-lg mb-3"
                        style={{ backgroundImage: `url(${post.image_url})` }}
                      />
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-4">
                        <button
                          className={`flex items-center text-xs ${
                            post.is_liked
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <ThumbsUp size={14} className="mr-1" />
                          {post.likes_count}
                        </button>
                        <button className="flex items-center text-xs text-muted-foreground">
                          <MessageCircle size={14} className="mr-1" />
                          {post.comments_count}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center text-xs text-muted-foreground">
                              <Share size={14} className="mr-1" />
                              Share
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleSharePost(post, "facebook")}
                            >
                              <Facebook size={14} className="mr-2" />
                              Share on Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSharePost(post, "twitter")}
                            >
                              <Twitter size={14} className="mr-2" />
                              Share on Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSharePost(post, "linkedin")}
                            >
                              <Linkedin size={14} className="mr-2" />
                              Share on LinkedIn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSharePost(post, "instagram")}
                            >
                              <Instagram size={14} className="mr-2" />
                              Copy for Instagram
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSharePost(post, "copy")}
                            >
                              <Copy size={14} className="mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update your post content</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Textarea
                placeholder="What's on your mind about dental health?"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="min-h-[120px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseAIToFix}
                  disabled={isGeneratingAI || !newPost.content.trim()}
                  className="flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  {isGeneratingAI ? "Generating..." : "Use AI to fix"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ImageIcon size={14} />
                  Add Image
                </Button>
              </div>
            </div>
            <Input
              placeholder="Image URL (optional)"
              value={newPost.image_url}
              onChange={(e) =>
                setNewPost({ ...newPost, image_url: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditPost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
