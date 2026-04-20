# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Shopify headless setup

This frontend is prepared to read products from the Shopify Storefront API when the following environment variables are set:

- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN`
- `VITE_SHOPIFY_API_VERSION`

Copy `.env.example` to `.env.local` and fill in the values from your Shopify store.

If you also want a server-side app or middleware for admin operations, keep these secrets on the backend only:

- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET_KEY`
# new-site
