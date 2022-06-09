import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const homepageHosts = [
  'localhost:3000',
  process.env['VERCEL_URL']
];

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.communalparking.com, demo.localhost:3000)
  // get rid of beta prefix to allow for beta versions of the site
  const hostname = req.headers.get('host');

  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // Gets the primary subdomain of the host
  // ladera.communalparking.com -> ladera
  // ladera.beta.communalparking.com -> ladera
  const currentHost = hostname.match(/(\w+)(?=\..+(:\d+|\.\w+))/g)?.[0] ?? '';

  if (pathname.startsWith('/_sites'))
    return new Response(null, {
      status: 404,
    });

  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    if (homepageHosts.includes(hostname)){
      url.pathname = `/home${pathname}`;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${currentHost}${pathname}`;
    return NextResponse.rewrite(url);
  }
}
