import { useNavigate } from 'react-router-dom';
import type { ChatInfo, RoomInfo } from '~/types';
import Card from '~/components/ui/Card';

type RoomCardProps = {
  room: RoomInfo;
};

export default function RoomCard(
  { room: { id, title, users, chats } }: RoomCardProps,
) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${id}`);
  };

  return (
    <Card onClick={handleClick}>
      <header className='flex justify-between'>
        <h3 className='font-semibold text-slate-700 group-hover:text-grey-700'>
          {title}
        </h3>
        <span className='text-slate-700 group-hover:text-grey-700'>
          {users.map((user) => user.username).join(', ')}
        </span>
      </header>
      <span className='text-slate-500 group-hover:text-grey-500 line-clamp-1'>
        {getLastChat(chats)}
      </span>
    </Card>
  );
}

function getLastChat(chats?: ChatInfo[]) {
  const lastChat = (chats ?? []).at(-1);
  return lastChat?.message ?? 'No message';
}
