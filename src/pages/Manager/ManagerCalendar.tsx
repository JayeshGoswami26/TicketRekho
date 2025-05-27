import { useState, useEffect } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface TicketCount {
  date: string;
  count: number;
}

interface TicketCountsMap {
  [day: number]: number;
}

const ManagerCalendar = () => {
  const [ticketCounts, setTicketCounts] = useState<TicketCountsMap>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // Function to fetch ticket counts from the API
  const fetchTicketCounts = async (month: number, year: number) => {
    try {
      const response = await axios.post<{
        data: { ticketsCount: TicketCount[] };
      }>(
        `${Urls.ManCalendarUrl}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          params: { month: month + 1, year }, // Adjust month for API (0-index to 1-index)
        },
      );

      const data = response.data.data.ticketsCount;

      // Check if the data is an array before applying reduce
      if (Array.isArray(data)) {
        const countsMap: TicketCountsMap = data.reduce((acc, current) => {
          const dateObj = new Date(current.date);
          const ticketYear = dateObj.getFullYear();
          const ticketMonth = dateObj.getMonth();
          const ticketDay = dateObj.getDate();

          // Only add the ticket count if the year and month match the current calendar view
          if (ticketYear === year && ticketMonth === month) {
            acc[ticketDay] = current.count;
          }
          return acc;
        }, {} as TicketCountsMap);

        setTicketCounts(countsMap);
      } else {
        console.error('Expected data to be an array, but got:', data);
      }
    } catch (error) {
      console.error('Error fetching ticket counts:', error);
    }
  };

  useEffect(() => {
    fetchTicketCounts(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  // Calculate number of days in the current month and the starting day of the week
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Last day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Day of week (0 = Sunday)

  const renderDays = () => {
    const days = [];

    // Add empty cells before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <td
          key={`empty-${i}`}
          className="border border-stroke dark:border-strokedark"
        />,
      );
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <td
          key={day}
          className="relative h-20 border border-stroke p-2 cursor-pointer transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31"
        >
          <span className="font-medium text-black dark:text-white">{day}</span>
          {renderCount(day)}
        </td>,
      );
    }

    // Ensure full 7-day rows by adding empty cells after the end of the month
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = totalCells % 7;
    if (remainingCells !== 0) {
      for (let i = 0; i < 7 - remainingCells; i++) {
        days.push(
          <td
            key={`empty-end-${i}`}
            className="border border-stroke dark:border-strokedark"
          />,
        );
      }
    }

    return days;
  };

  const renderCount = (day: number) => {
    return ticketCounts[day] ? (
      <div className="group h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
        <span className="group-hover:text-primary md:hidden">More</span>
        <div className="event invisible absolute left-2 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[unset] md:opacity-100">
          <span className="event-name text-sm font-semibold text-black dark:text-white">
            {`Tickets Sold: ${ticketCounts[day]}`}
          </span>
        </div>
      </div>
    ) : null;
  };

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11; // December of previous year
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0; // January of next year
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <button
          className="flex items-center gap-2 px-2 md:px-[unset]"
          onClick={() => changeMonth(-1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-lg" />
          <span className="hidden md:block">Previous Month</span>
        </button>
        <h2 className="text-xl font-bold">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h2>
        <button
          className="flex items-center gap-2 px-2 md:px-[unset]"
          onClick={() => changeMonth(1)}
        >
          <span className="hidden md:block">Next Month</span>
          <FontAwesomeIcon icon={faAngleRight} className="text-lg" />
        </button>
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, index) => (
                  <th
                    key={index}
                    className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                  >
                    {day}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-7">{renderDays()}</tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManagerCalendar;
