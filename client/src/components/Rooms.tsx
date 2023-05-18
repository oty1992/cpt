import { useNavigate } from 'react-router-dom';
import useRooms from '../hooks/useRooms';
import NoRoomCard from './NoRoomCard';
import RoomCard from './RoomCard';
import Action from './ui/Action';
import Section from './ui/Section';

export default function Rooms() {
  const { roomsQuery: { data: rooms } } = useRooms();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/room/create');
  };

  return (
    <Section>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Rooms</h1>
      <div className='relative w-80 sm:w-2/3 max-w-xl min-w-max p-10 rounded-3xl bg-slate-200'>
        <ul className='flex flex-col gap-2 w-full mb-4'>
          {!rooms?.length
            ? <NoRoomCard />
            : rooms.map((room) => <RoomCard key={room.id} room={room} />)}
        </ul>
        <div className='absolute bottom-2 right-3'>
          <Action
            actionType='button'
            title='Create'
            isDisable={false}
            onClick={handleClick}
          />
        </div>
      </div>
    </Section>
  );
}
