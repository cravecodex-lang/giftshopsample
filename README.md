# Mr & Mrs Gifts

Responsive React storefront with a contact-enquiry API backed by MongoDB.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to a MongoDB database you control.
3. Add the real business contact values and URLs to the `VITE_CONTACT_*` variables. Leave unknown details blank; the site shows that they are not configured.
4. Install dependencies with `npm install`.
5. Run the website and API together with `npm run dev`.

The Vite development server proxies `/api` requests to the Express API on port `5000`. To run only the frontend, use `npm run dev:client`. To run the API separately, use `npm run server`.

## Contact enquiries

`POST /api/contact` validates and stores contact messages in the `ContactEnquiry` MongoDB collection. Enquiries contain the customer name, email, phone, subject, and message. This repository does not include an admin panel; use an authenticated MongoDB/admin tool to review stored enquiries.

The contact form requires the API and MongoDB to be available. The API returns a clear service-unavailable response when `MONGODB_URI` is missing or MongoDB cannot be reached.

## Build

- `npm run build` creates the production frontend bundle.
- `npm run lint` runs Oxlint.
