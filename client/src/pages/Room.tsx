import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MdDelete } from 'react-icons/md';
import Section from '~/components/ui/Section';
import ChatList from '~/components/ChatList';
import SendMessage from '~/components/SendMessage';
import { useAuthContext } from '~/contexts/AuthContext';
import useRooms from '~/hooks/useRooms';

export default function Room() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { roomQuery, deleteRoom, sendMessage } = useRooms();
  const { data: room } = roomQuery(id || '');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    id && deleteRoom.mutate(id);
    navigate('/', { replace: true });
  };

  const handleSendMessage = (message: string) => {
    sendMessage.mutate({ roomId: id ?? '', message });
  };

  return (
    <>
      {room && (
        <Section className='px-4'>
          <Helmet>
            <title>{`${room.title} - Chat Room | CPT`}</title>
          </Helmet>
          <header className='flex justify-between items-center w-full max-w-xl h-16 pl-3 gap-4'>
            <button
              className='text-3xl w-10 h-10 pb-1 rounded-full text-slate-700 hover:bg-slate-300'
              onClick={handleBack}
            >
              {'<'}
            </button>
            <h2 className='text-4xl text-slate-700'>{room.title}</h2>
            <button
              className='flex justify-center items-center text-3xl w-10 h-10 pb-1 rounded-full text-slate-700 hover:bg-slate-300'
              onClick={handleDelete}
            >
              <MdDelete />
            </button>
          </header>
          <ChatList userId={user?.userId ?? ''} room={room} />
          <SendMessage onSend={handleSendMessage} />
        </Section>
      )}
    </>
  );
}
