# React Web & React Native Apps

Seven front-end apps: four for the web (React + Vite) and three for mobile (React Native + Expo). They range from routed multi-page UIs and authenticated chat to an LLM chat client and a tool-calling AI agent.

| App | Platform | Highlights |
| --- | --- | --- |
| [Badger Buddies](web/badger-buddies) | Web | Pet-adoption browser: multi-page routing, shared context, a saved-pets basket persisted in `sessionStorage` |
| [Badger Chat](web/badger-chat) | Web | Chatrooms with register, login and logout, paginated message feeds, and posting and deleting your own messages |
| [Badger ChatGPT](web/badger-chatgpt) | Web | LLM chat client with switchable personas, persisted conversations, and Markdown-rendered replies |
| [Badger Chat Agent](web/badger-chat-agent) | Web | AI agent that drives the chat app through **7 tools** (`whoami`, `get_chatrooms`, `get_messages`, `create_post`, plus login/register/logout handoffs to UI modals). A confirmation modal gates every post it makes |
| [Badger Mart](mobile/badger-mart) | iOS / Android | Store catalog browser built with React Native core components |
| [Badger News](mobile/badger-news) | iOS / Android | Bottom tabs + native stack navigation, an article feed, animated article screens, and tag-preference toggles |
| [Badger Chat Mobile](mobile/badger-chat) | iOS / Android | Drawer navigation between chatrooms, JWT stored in `expo-secure-store`, register, login and guest modes, modal post composer |

## Tech stack

**Web:** React · Vite · React Router · React Bootstrap · react-markdown
**Mobile:** React Native · Expo · React Navigation (tabs, stack, drawer) · expo-secure-store · React Native Paper · Animated API

## Running an app

Each app reads its backend settings from environment variables. Copy `.env.example` to `.env` in the app folder and fill it in:

| Variable (web `VITE_*` / mobile `EXPO_PUBLIC_*`) | Meaning |
| --- | --- |
| `API_BASE` | Base URL of the REST backend |
| `API_KEY_HEADER` | Name of the header that carries the access key |
| `API_KEY` | Your access key |
| `IMAGE_BASE` | Base URL for static images (Badger Buddies, Badger News) |

```bash
# web
cd web/badger-chat
cp .env.example .env
npm install
npm run dev

# mobile
cd mobile/badger-news
cp .env.example .env
npm install
npx expo start
```

The apps expect a REST backend that provides auth, chatrooms and messages, articles, catalog items, and AI completions.

## License

MIT. The original app scaffolding is © its authors; see [LICENSE](LICENSE).

---

*Date finished: April 27, 2026*
