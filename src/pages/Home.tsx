import Hero from '../sections/Hero'
import Verse from '../sections/Verse'
import What from '../sections/What'
import Story from '../sections/Story'
import Flow from '../sections/Flow'
import Glance from '../sections/Glance'
import Vision from '../sections/Vision'
import Covers from '../sections/Covers'
import Calculator from '../sections/Calculator'
import Close from '../sections/Close'

/**
 * There is no About page, so this is it. The order answers the questions in the
 * order a stranger actually asks them: what is this, where does the name come
 * from, who are you, how did it start, how does it work, how much, where is it
 * going, and only then, what would my money do.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Verse />
      <What />
      <Story />
      <Flow />
      <Glance />
      <Vision />
      <Covers />
      <Calculator />
      <Close />
    </main>
  )
}
