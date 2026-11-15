import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PersonCard from '../components/PersonCard';
import { getPeopleDetails, type PersonDetailsEx } from '../api/tmdb/api-utils';


const PersonPage = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetailsEx | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPerson = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPeopleDetails(Number(id));
        setPerson(data);
      } catch (err) {
        setError('Не удалось загрузить данные о персоне.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!person) return <div className="text-center py-20">Персона не найдена.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <PersonCard person={person} />
    </div>
  );
};

export default PersonPage;