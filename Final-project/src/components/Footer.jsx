export default function Footer() {
  return (
    <footer className="bg-green-900 p-3 text-center text-sm text-white">
      © 2025 RideFlow Rentals. All rights reserved.
      <div className="flex justify-center gap-5 py-3">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/fblogo.png" alt="FacebookLink" className="h-7 w-7" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/iglogo.png" alt="instagramLink" className="h-7 w-7" />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/xlogo.png" alt="xLink" className="h-7 w-7" />
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/Tiktok_icon.svg.png" alt="tiktokLink" className="h-7 w-7" />
        </a>
      </div>
    </footer>
  )
}
