/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.html",
    "./frontend/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6FAAF7', // 기존 primary보다 밝은 톤
          DEFAULT: '#4A90E2', // PRD의 Primary Color
          dark: '#3A7AD9', // 기존 hover:bg-blue-600에 가까운 톤, 또는 더 세련된 어두운 톤
        },
        secondary: '#F5F7FA',
        text_dark: '#333333',
        text_light: '#FFFFFF',
        success: '#50E3C2',
        error: '#D0021B',
        border_light: '#E0E6ED',
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

