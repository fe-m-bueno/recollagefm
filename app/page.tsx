import TheFooter from "@/components/TheFooter";
import UserInput from "@/components/UserInput";
import Features from "@/components/Features";
import TheNavBar from "@/components/TheNavBar";
import Logo from "@/public/recollage.svg";
import Callout from "@/components/Callout";

export default function Home() {
  const features = [
    {
      title: "gatekeep",
      sub: "gatekeepSub",
      content: "gatekeepContent",
      image: "gatekeep",
    },
    {
      title: "spare",
      sub: "spareSub",
      content: "spareContent",
      image: "spare",
    },
    {
      title: "move",
      sub: "moveSub",
      content: "moveContent",
      image: "move",
    },
  ];

  return (
    <div className="relative h-full min-h-screen flex flex-col items-center justify-between">
      <div className="w-full flex flex-row justify-end">
        <Callout />
        <div className="w-fit">
          <TheNavBar />
        </div>
      </div>
      <div>
        <Logo className="~w-[16rem]/[36rem] h-auto dark:text-white/90 text-blue-600 fill-current pb-4 px-2" />
      </div>
      <UserInput />
      <div className="flex flex-wrap justify-between items-center min-w-96 gap-6 px-4 mt-4">
        {features.map((f, index) => (
          <Features
            key={index}
            title={f.title}
            content={f.content}
            sub={f.sub}
            image={f.image}
          />
        ))}
      </div>
      <TheFooter />
    </div>
  );
}
