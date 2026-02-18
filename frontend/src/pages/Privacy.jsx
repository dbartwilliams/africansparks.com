import React  from 'react'
import { Header } from '../components/Header';

const Privacy = () => {
          
  return (
    <main className="min-h-screen">
       {/* Header */}
       <div className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
           <Header/>
             </div>
            <div className="px-10">
                <div className='mt-5 mb-10'>
                    <h1 className='mb-2 text-3xl text-gray-300'>Terms</h1>
                    <p class="font-normal leading-relaxed mx-auto text-slate-400 lg:text-lg text-base max-w-3xl">
                    By using AfricanSparks social media, you agree to our Terms of Service, which govern access, acceptable use, and user responsibilities. We use cookies and similar technologies to improve functionality, enhance user experience, and analyze platform performance; you may manage cookie preferences through your browser settings. We respect your privacy and are committed to protecting your personal data. any information collected is handled securely, used only for legitimate purposes, and never sold to third parties. Continued use of this site constitutes acceptance of these terms and policies.
                    </p>           
                </div>

                <div className='mb-10'>
                    <h1 className='mb-2 text-3xl text-gray-300'>Privacy</h1>
                    <p class="font-normal leading-relaxed mx-auto text-slate-400 lg:text-lg text-base max-w-3xl">
                    Really hard to make everyone happy with a Privacy Policy. Most people who use AfricanSparks want something short and easy to understand. While we wish we could fit everything you need to know into a post, our regulators ask us to meet our minimum required standard. there yiu have it.
                    </p>           
                </div>

                <div className='mb-10'>
                    <h1 className='mb-2 text-3xl text-gray-300'>Cookies</h1>
                    <p class="font-normal leading-relaxed mx-auto text-slate-400 lg:text-lg text-base max-w-3xl">
                    Cookies and similar technologies like pixels and local storage provide you with a better, faster, and safer experience on AfricanSparks. Cookies are also used to operate our services.
                    </p>           
                </div>
            </div>
    </main>
  )
}

export default Privacy