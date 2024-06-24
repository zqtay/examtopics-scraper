# ExamTopics Scraper
Scrape exam questions from ExamTopics discussions page.

## Getting Started
1. Clone this repo
```sh
git clone https://github.com/zqtay/examtopics-scraper.git
cd examtopics-scraper
```
2. Install dependencies
```sh
npm ci
```
3. Add `.env.local` file.
```sh
NEXTAUTH_ADMIN_USER=admin
NEXTAUTH_ADMIN_PASSWORD=password
NEXTAUTH_SECRET=secret
NEXTAUTH_URL=http://localhost:3000
```
4. Run development server
```sh
npm run dev
```
5. Open `http://localhost:3000` in browser