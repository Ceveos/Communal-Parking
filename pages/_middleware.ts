import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// If a domain is custom, we need to look up what community they are.
// If not custom, we can read the subdomain to know what community they're meant to be.
const nonCustomizedDomains = [
  'localhost:3000',
  'communalparking.com',
  process.env['DOMAIN'],
];

export default async function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.communalparking.com, demo.localhost:3000)
  const hostname = req.headers.get('host');

  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // Gets the primary subdomain of the host
  // ladera.communalparking.com -> ladera
  // ladera.beta.communalparking.com -> ladera
  // ladera.localhost:3000 -> ladera
  const currentHost = hostname.match(/(\w+)(?=\..+(:\d+|\.\w+))/g)?.[0] ?? '';

  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    // If a vercel deployment url is provided, we should process the request
    // a bit different to allow testing of the whole site
    if (hostname.endsWith('vercel.app')) {
      if (!pathname.startsWith('/_sites')) {
        url.pathname = `/home${pathname}`;
        return NextResponse.rewrite(url);
      } else {
        return;
      }
    }

    // If not a customized domain, look at the currentHost
    if (nonCustomizedDomains.some(x => hostname.endsWith(x!))){
      if (currentHost === 'www' || currentHost === '') {
        url.pathname = `/home${pathname}`;
      } else {
        url.pathname = `/_sites/${currentHost}${pathname}`;;
      }
      return NextResponse.rewrite(url);
    }

    // If custom domain, pass hostname to the _sites path
    url.pathname = `/_sites/${hostname}${pathname}`;
    return NextResponse.rewrite(url);
  }
}
