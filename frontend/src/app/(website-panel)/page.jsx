import Hero from "../component/website/Hero"
import Features from "../component/website/Features"
import Promo from "../component/website/promo"
import NewArrivals from "../component/website/NewArrivals"
import BestSelling from "../component/website/BestSelling"

export default function MainPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Hero />

      <section id="newarrivals" className="container mx-auto px-4 py-12 md:py-16">
        <NewArrivals />
      </section>

      <section id="bestsellers" className="container mx-auto px-4 py-12 md:py-16">
        <BestSelling />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <Promo />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <Features />
      </section>
    </main>
  )
}
