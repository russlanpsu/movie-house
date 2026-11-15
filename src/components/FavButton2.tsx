interface FavButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export function FavButton2({ isFavorite, onClick }: FavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      aria-pressed={isFavorite}
      style={{
        width:44,
        height:44,
        borderRadius:'50%',
        background: '#14161a',
        border:0,
        color: isFavorite ? '#f2b84b' : '#f2efe8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
      // className="movie-card__fav"
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`size-6 transition-colors duration-200 ${
          isFavorite ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"
        }`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
      </svg> */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  );
}