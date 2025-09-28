# 🦷 Dent App - All-in-One Dental Clinic Platform

A comprehensive lead-generation platform for dental clinics that streamlines online marketing, engagement, and patient management through an integrated suite of AI-powered applications.

## 🚀 Quick Start

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd dent-for-one

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys:
# VITE_GROQ_API_KEY=your-groq-api-key
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Start development server
npm run dev
```

## 🎯 Platform Overview

Dent App is designed to modernize dental practices by providing a unified digital ecosystem that enhances patient experiences and streamlines clinic operations. The platform consists of four core applications, each powered by advanced AI and automation technologies.

## 📱 Core Applications

### 1. 🛒 **Marketplace App**

**Purpose**: Online shop for dental care products with affiliate marketing capabilities

**Key Features**:

- Product catalog with categories and filters
- Secure payment processing
- Affiliate link generation for patient referrals
- Loyalty points system
- Expert product recommendations
- Real-time inventory management

**Benefits**:

- **Revenue diversification** - Additional income stream from product sales
- **Patient retention** - Loyalty programs encourage repeat visits
- **Referral incentives** - Patients earn rewards for bringing new customers
- **Brand building** - Curated product selection enhances clinic reputation

### 2. 🤖 **Social Share App** _(Enhanced with Groq AI)_

**Purpose**: AI-powered content automation tool for staff-driven marketing campaigns

#### 🎨 **Advanced AI Features**

**AI-Powered Content Creation**:

- **Professional Content Generation**: Staff can generate professional content instantly with consistent brand voice
- **Generate from Scratch**: AI creates engaging dental health posts from nothing
- **Content Improvement**: Enhance existing content with better formatting and engagement
- **Smart Hashtag Generation**: Automatic generation of relevant, trending hashtags
- **Platform-Specific Optimization**: One-click optimization for Instagram, Twitter, LinkedIn

**Smart Hashtag Suggestions**:

- **Trending Analysis**: Automatically add trending and relevant hashtags based on current dental industry trends
- **Engagement Optimization**: Hashtags optimized for maximum reach and visibility
- **Location-Based Hashtags**: Include relevant local hashtags when appropriate
- **Mix of Trending & Evergreen**: Balance between current trends and timeless hashtags

**Professional Tone Control**:

- **Brand Voice Consistency**: Maintain consistent brand voice across all posts
- **Tone Selection**: Professional, casual, educational, or motivational
- **Brand Voice Options**: Friendly, authoritative, caring, or modern
- **Content Type Selection**: Tip, story, educational, promotional, or community content
- **Target Audience**: Optimize for patients, professionals, or general audience
- **Engagement Optimization**: Toggle to maximize social media engagement
- **Brand Voice Analysis**: AI-powered feedback on content consistency and professionalism

**Smart Features**:

- **Search & Filter**: Find posts by content, author, or AI-generated status
- **Real-time Analytics**: Track engagement metrics and performance
- **Multi-platform Sharing**: Direct sharing to Facebook, Twitter, LinkedIn, Instagram
- **Content Validation**: Ensure posts meet platform requirements
- **Brand Voice Consistency Checker**: AI-powered analysis of content alignment with brand standards
- **Professional Content Templates**: Pre-configured settings for different content types
- **AI Performance Dashboard**: Real-time insights into AI-generated content performance
- **Engagement Tracking**: Comprehensive metrics for views, shares, saves, and reach
- **Hashtag Performance Analytics**: Track which hashtags drive the most engagement
- **AI Analytics Dashboard**: Real-time insights into content performance and AI generation metrics
- **Advanced Filtering**: Filter by AI generation status, content type, and brand voice scores

**Benefits**:

- **Amplified brand reach** - Multi-platform sharing expands visibility
- **Staff-driven marketing** - Empowers clinic staff as brand ambassadors
- **Increased patient engagement** - Community-driven content builds relationships
- **Cost-effective marketing** - Reduces traditional advertising costs
- **Enhanced lead generation** - Viral sharing potential drives new patients

### 3. 🦷 **Patient Care App**

**Purpose**: Personalized dental care routines with gamified habit tracking

#### 🎯 **Core Features**

**Smart Habit Tracking**:

- Personalized daily routines with streak tracking
- Progress visualization with real-time updates
- Scheduled reminders and notifications
- Customizable habit categories

**Gamification System**:

- Points and level progression
- Achievement badges and milestones
- Streak tracking with visual indicators
- Leaderboards and challenges

**Progress Analytics**:

- Weekly and monthly overviews
- Habit completion patterns
- Performance trends and insights
- Goal setting and tracking

**Appointment Integration**:

- Seamless connection with booking system
- Preparation reminders and tips
- Post-appointment follow-ups
- Treatment plan integration

**Personalized Recommendations**:

- AI-powered product suggestions
- Customized care routines
- Treatment-specific advice
- Progress-based recommendations

**Benefits**:

- **Better patient outcomes** - Gamified tracking improves compliance
- **Higher engagement rates** - Points and badges motivate consistent care
- **Reduced treatment costs** - Preventive care avoids expensive procedures
- **Improved patient retention** - Ongoing engagement builds loyalty
- **Data-driven insights** - Analytics inform treatment planning

### 4. �� **Booking App**

**Purpose**: Seamless appointment scheduling with real-time availability

**Key Features**:

- Real-time availability calendar
- Provider selection and filtering
- Appointment type categorization
- Automated reminders and confirmations
- Integration with existing clinic systems
- Virtual appointment support

**Benefits**:

- **Streamlined scheduling** - Reduces administrative workload
- **Improved patient experience** - 24/7 booking availability
- **Reduced no-shows** - Automated reminders and confirmations
- **Better resource utilization** - Optimized scheduling reduces gaps

## 🔄 n8n Workflow Automation

### Advanced Social Media Automation

The Dent App includes comprehensive **n8n workflow integration** for advanced social media automation:

#### **Automated Content Processing**

- **AI Content Analysis** - Automatic quality assessment and optimization
- **Multi-Platform Adaptation** - Content optimization for Facebook, Instagram, Twitter, LinkedIn
- **Smart Scheduling** - Optimal posting time recommendations
- **Brand Voice Consistency** - Automated brand compliance checking

#### **Real-Time Analytics & Insights**

- **Performance Tracking** - Live engagement metrics and trend analysis
- **Predictive Analytics** - AI-powered engagement forecasting
- **ROI Analysis** - Lead generation and conversion tracking
- **Competitive Intelligence** - Market trend monitoring

#### **Automated Workflows**

- **Content Publishing** - Multi-platform automated posting
- **Engagement Management** - Automated responses and community building
- **Lead Generation** - Patient education and appointment booking automation
- **Crisis Management** - Automated monitoring and response protocols

#### **Integration Features**

- **Webhook-Based** - Real-time event processing
- **AI-Powered** - Advanced content analysis and optimization
- **Multi-Service** - Google Sheets, Slack, social media APIs
- **Scalable** - Handles high-volume content and engagement

### Quick Setup

1. **Import Workflow** - Use `n8n-workflows/dent-app-social-automation.json`
2. **Configure APIs** - Set up OpenAI, Google Sheets, Slack credentials
3. **Test Integration** - Use built-in webhook tester component
4. **Activate Automation** - Enable real-time social media automation

📖 **[Complete n8n Setup Guide](./n8n-workflows/README.md)**

## 🛠️ Technical Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for data fetching

### Backend & Database

- **Supabase** for backend services with real-time capabilities
- **PostgreSQL** for data storage with advanced JSON fields for AI metadata
- **Real-time subscriptions** for live updates and engagement tracking
- **Row Level Security** for data protection and user privacy
- **Enhanced Post Schema** with AI generation options, metadata, and engagement metrics
- **AI Analytics Engine** for comprehensive content performance analysis
- **Engagement Tracking System** for views, shares, saves, and reach metrics
- **Brand Voice Scoring** with AI-powered consistency analysis

### AI & Integrations

- **Groq AI** for content generation and optimization
- **Llama 3.3 70B** model for advanced language processing
- **Professional Content Generation** with brand voice consistency
- **Smart Hashtag Analysis** with trending detection
- **Brand Voice Analysis** for content quality assurance
- **OpenAI** for additional AI capabilities
- **Social media APIs** for platform integration
- **n8n Workflow Automation** for advanced social media automation
- **Real-time Webhook Integration** for seamless automation

### Backend & Database Integration

- **Enhanced Post Schema**: AI generation options, brand voice scores, content types
- **Engagement Metrics**: Real-time tracking of post performance and hashtag effectiveness
- **AI Analytics**: Comprehensive analytics for content performance and AI generation quality
- **Brand Voice Scoring**: Automated scoring system for content consistency
- **Content Categorization**: Automatic classification of posts by type and audience

### Development Tools

- **ESLint** for code quality
- **Prettier** for code formatting
- **TypeScript** for type safety
- **GitHub Pages** for deployment

## 🎨 UI/UX Features

### Modern Design System

- **Responsive design** - Works on all devices
- **Dark/Light mode** support
- **Accessible components** - WCAG compliant
- **Smooth animations** and transitions
- **Intuitive navigation** with bottom navigation

### User Experience

- **Real-time updates** without page refreshes
- **Offline support** for core features
- **Progressive Web App** capabilities
- **Push notifications** for important updates
- **Loading states** and error handling

## 🔧 Environment Setup

### Required Environment Variables

```env
# Groq AI for content generation
VITE_GROQ_API_KEY=your-groq-api-key

# Supabase configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: OpenAI for additional AI features
VITE_OPENAI_API_KEY=your-openai-api-key
```

### Database Schema

The platform requires the following Supabase tables:

#### Core Tables

- `profiles` - User profile information
- `posts` - Social media posts with enhanced AI metadata
- `products` - Marketplace product catalog
- `appointments` - Booking system data
- `habits` - Patient care tracking data

#### Enhanced Posts Table Schema

```sql
-- Enhanced posts table with AI capabilities
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_avatar TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_generated_by_ai BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT,
  ai_generation_options JSONB, -- Stores AI configuration options
  brand_voice_score DECIMAL(3,1), -- 0.0 to 10.0 score
  content_type TEXT DEFAULT 'tip', -- tip, story, educational, promotional, community
  engagement_metrics JSONB, -- Stores performance metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes table for engagement tracking
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

## 🚀 Deployment

### Development

```sh
npm run dev
```

### Production Build

```sh
npm run build
npm run preview
```

### GitHub Pages Deployment

```sh
npm run deploy
```

## 📊 Analytics & Insights

### Social Share Analytics

- **Post Engagement Metrics**: Views, shares, saves, reach, impressions, and engagement rates
- **Platform Performance Comparison**: Cross-platform sharing effectiveness analysis
- **AI-Generated vs Manual Content Performance**: Performance comparison between AI and human-created content
- **Hashtag Effectiveness Tracking**: Detailed analysis of hashtag performance and trending patterns
- **Staff Participation Metrics**: Track staff engagement and content creation patterns
- **Brand Voice Consistency Scores**: AI-powered analysis of brand voice alignment (1-10 scale)
- **Professional Content Performance Analysis**: Quality metrics and engagement predictions
- **Trending Hashtag Effectiveness**: Real-time hashtag performance tracking
- **Content Type Performance Comparison**: Analysis by tip, story, educational, promotional, and community content
- **AI Confidence Scoring**: Track AI generation confidence, content quality, and engagement predictions
- **Real-time Analytics Dashboard**: Live updates of content performance and AI insights

### Patient Care Analytics

- Habit completion rates
- Patient engagement levels
- Treatment outcome correlations
- Appointment adherence tracking
- Product recommendation effectiveness

### Marketplace Analytics

- Sales performance by product
- Affiliate referral tracking
- Customer lifetime value
- Inventory turnover rates
- Revenue attribution

## 🔒 Security & Privacy

- **Row Level Security** in Supabase
- **JWT authentication** with secure token handling
- **Data encryption** at rest and in transit
- **HIPAA compliance** considerations for patient data
- **Regular security audits** and updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@dentalapp.com
- **Phone**: +1 (555) 123-4567
- **Documentation**: [docs.dentalapp.com](https://docs.dentalapp.com)
- **Community**: [community.dentalapp.com](https://community.dentalapp.com)

## 🎯 Roadmap

### Phase 2 Features (Q2 2025)

- **Advanced AI Analytics** - Predictive insights for patient behavior
- **Mobile App** - Native iOS and Android applications
- **Telemedicine Integration** - Virtual consultation capabilities
- **Advanced Reporting** - Comprehensive clinic performance dashboards

### Phase 3 Features (Q3 2025)

- **Multi-location Support** - Manage multiple clinic locations
- **Advanced Automation** - AI-powered workflow automation
- **Third-party Integrations** - Connect with existing clinic software
- **White-label Solutions** - Customizable branding options

---

**Dent App** - Transforming dental practices through intelligent automation and patient engagement.
