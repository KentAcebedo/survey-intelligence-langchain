# 📊 AI Survey Intelligence

> Transform qualitative feedback into actionable insights using AI-powered analysis

A modern web application that leverages **LangChain.js** and **Google Gemini AI** to analyze survey responses, extract structured insights, and generate strategic recommendations. 
Perfect for businesses looking to understand customer feedback at scale. 


## Note: This project is "vibe coded." The primary purpose of this prototype is to build a functional understanding of LangChain and how to bridge raw survey data with AI-driven insights.

**Link**: https://langchain-survey-analysis.netlify.app/
![Tech Stack](https://img.shields.io/badge/LangChain.js-FF6B6B?style=for-the-badge&logo=langchain&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- 📁 **CSV Upload Support** - Upload and analyze bulk survey responses from CSV files
- 💬 **Manual Input** - Paste survey responses directly for quick analysis
- 📊 **Statistical Analysis** - Get comprehensive statistics including:
  - Total response count
  - Sentiment breakdown (Positive/Negative/Neutral) with percentages
  - Topic frequency analysis
  - Priority level distribution
- 🎯 **Structured Insights** - Each response analyzed for:
  - Sentiment classification
  - Topic identification
  - Priority assessment
- 💡 **Strategic Recommendations** - AI-generated, data-driven recommendations
- 🎨 **Modern UI** - Clean, professional dashboard design with Tailwind CSS
- ⚡ **Fast & Efficient** - Powered by Gemini 1.5 Flash for quick analysis

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **AI Framework**: LangChain.js (LCEL - LangChain Expression Language)
- **AI Model**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Font Awesome (optional)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
  
   - git clone [(https://github.com/KentAcebedo/survey-intelligence-langchain.git)]
   - cd LangChain

2. **Install dependencies**h
   - npm install
3. **Start development server**
   - npm run dev
4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - Enter your Google AI API key
   - Start analyzing surveys!

---

## 📖 Usage

### Option 1: Upload CSV File

1. Click "Upload CSV File"
2. Select your CSV file (must have a column with survey responses)
3. The app will auto-detect and extract responses
4. Click "Analyze Survey"

### Option 2: Manual Input

1. Paste survey responses in the textarea (one per line)
2. Click "Analyze Survey"
3. View your comprehensive analysis report

### Understanding the Results

The analysis provides:

- **Statistics Dashboard**: Visual overview of sentiment distribution
- **Detailed Analysis**: Response-by-response breakdown with sentiment, topic, and priority
- **Strategic Recommendations**: Actionable insights based on the data

---

## 📁 Project Structure
   npm install   npm install## Environment Setup

No environment variables needed! Users enter their API key directly in the UI for security and flexibility.

### Build for Production
h
npm run buildThis creates an optimized build in the `dist/` folder.

---

## 🌐 Deployment

### Deploy to Netlify

1. **Build the project**
   npm run build
   2. **Deploy via Netlify Dashboard**
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Or use Netlify CLI**
   
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ### Netlify Configuration

Create `netlify.toml`:
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200---

## 🎓 Learning Resources

This project demonstrates:

- **LangChain Expression Language (LCEL)** - Building AI pipelines with the pipe operator
- **Prompt Templates** - Creating reusable, structured prompts
- **Async/Await** - Handling asynchronous AI operations
- **Chain Composition** - Multi-step AI workflows
- **File Handling** - CSV parsing and FileReader API
- **Modern JavaScript** - ES6 modules, async patterns

---

## 📝 Example CSV Format

Your CSV file should have a column with survey responses:

Response,Rating,Date
The service was slow but the food was okay,3,2024-01-15
Customer service needs improvement,2,2024-01-16
Love the new features!,5,2024-01-17The app automatically detects columns named: `response`, `comment`, `feedback`, `answer`, or `text`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Kent Aron Acebedo**

Built with ❤️ using LangChain.js and Gemini AI

---

## 🙏 Acknowledgments

- [LangChain.js](https://js.langchain.com/) - For the amazing AI framework
- [Google Gemini](https://ai.google.dev/) - For the powerful AI model
- [Tailwind CSS](https://tailwindcss.com/) - For the beautiful styling
- [Vite](https://vitejs.dev/) - For the fast build tool

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with details
3. Include error messages and steps to reproduce

---

## 🎯 Roadmap

Future enhancements:

- [ ] Export analysis as PDF
- [ ] Multiple language support
- [ ] Custom topic categorization
- [ ] Historical data comparison
- [ ] Real-time collaboration

---

**⭐ Star this repo if you find it helpful!**
