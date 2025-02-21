import TheFooter from '@/components/TheFooter';
import UserInput from '@/components/UserInput';
import Features from '@/components/Features';
import TheNavBar from '@/components/TheNavBar';
import Logo from '@/public/recollage.svg';

export default function Home() {
  const features = [
    {
      title: 'gatekeep',
      sub: 'gatekeepSub',
      content: 'gatekeepContent',
      image: 'gatekeep',
    },
    {
      title: 'spare',
      sub: 'spareSub',
      content: 'spareContent',
      image: 'spare',
    },
    {
      title: 'move',
      sub: 'moveSub',
      content: 'moveContent',
      image: 'move',
    },
  ];

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-between">
      <TheNavBar />
      <div>
        <Logo className="~w-[20rem]/[36rem] h-auto dark:text-white/90 text-blue-600 fill-current pb-4" />
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
