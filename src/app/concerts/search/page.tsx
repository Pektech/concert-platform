export default function SearchConcertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="text-8xl mb-8">🎵</div>
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-white">
          Coming Soon
        </h1>
        
        {/* Description */}
        <div className="space-y-4 text-lg text-gray-300">
          <p>
            <strong className="text-purple-300">Your Favorite Artists' Upcoming Concerts</strong>
          </p>
          <p>
            Never miss a show! We'll notify you when artists you've reviewed 
            or liked are touring near you.
          </p>
          <div className="my-8 border-t border-white/10" />
          <p>
            <strong className="text-purple-300">Discover New Artists in Your Area</strong>
          </p>
          <p>
            Based on your reviews and likes, we'll recommend similar artists 
            touring near you.
          </p>
        </div>
        
        {/* CTA */}
        <div className="pt-8">
          <p className="text-sm text-gray-400">
            Keep reviewing concerts you've attended, and we'll help you 
            discover your next favorite live show.
          </p>
        </div>
        
        {/* Back Link */}
        <div className="pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
