import Hero from '../sections/Hero'
import What from '../sections/What'
import Story from '../sections/Story'
import Flow from '../sections/Flow'
import Glance from '../sections/Glance'
import Verse from '../sections/Verse'
import Close from '../sections/Close'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <What />
      <Story />
      <Flow />
      <Glance />
      <Verse />
      <Close />
    </main>
  )
}
