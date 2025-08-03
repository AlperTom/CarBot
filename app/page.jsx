import ChatWidget from '../components/ChatWidget'

export default function Home() {
  return (
    <>
      <ChatWidget clientKey={process.env.NEXT_PUBLIC_CLIENT_KEY} />
    </>
  )
}