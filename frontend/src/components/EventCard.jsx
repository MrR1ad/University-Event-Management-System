const CATEGORY_COLORS = {
  Workshop: "#74b9ff",
  Seminar: "#a29bfe",
  Competition: "#fdcb6e",
  Cultural: "#55efc4",
  Sports: "#ff7675",
  Academic: "#6c5ce7",
  Social: "#fd79a8",
};

const CATEGORY_CODES = {
  Workshop: "WK",
  Seminar: "SM",
  Competition: "CO",
  Cultural: "CU",
  Sports: "SP",
  Academic: "AC",
  Social: "SO",
};

export default function EventCard({ event, actions }) {
  const color = CATEGORY_COLORS[event.category] || "#74b9ff";
  const categoryCode = CATEGORY_CODES[event.category] || "EV";
  const pct = Math.min(
    100,
    Math.round((event.registered / event.capacity) * 100),
  );
  const isFull = event.registered >= event.capacity;

  return (
    <div className="soft-card" style={{ "--course-color": color }}>
      <div className="card-top">
        <div className="mood-badge">{event.category}</div>
        <StatusBadge status={event.status} />
      </div>

      <div className="course-main" style={{ marginBottom: 12 }}>
        <div
          className="event-initial"
          style={{
            background: `${color}22`,
            color,
            borderColor: `${color}55`,
          }}
          title={event.category || "Event"}
        >
          {categoryCode}
        </div>

        <div className="course-details">
          <h4>{event.title}</h4>
          <span>{event.venueName}</span>
        </div>
      </div>

      <p
        style={{
          fontSize: "0.82rem",
          color: "#888",
          lineHeight: 1.5,
          marginBottom: 14,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {event.description}
      </p>

      <div
        style={{
          fontSize: "0.8rem",
          color: "#636e72",
          marginBottom: 4,
        }}
      >
        Date: {formatDate(event.startDate)}
      </div>

      <div
        style={{
          fontSize: "0.8rem",
          color: "#636e72",
          marginBottom: 14,
        }}
      >
        👤 {event.organizerName || "Organizer"}
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Capacity</span>
          <strong>
            {event.registered}/{event.capacity}
          </strong>
        </div>

        <div className="soft-progress-bar">
          <div
            className="soft-progress-fill"
            style={{
              width: `${pct}%`,
              background: isFull ? "#e74c3c" : pct >= 80 ? "#fdcb6e" : color,
            }}
          />
        </div>

        {isFull && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#f39c12",
              marginTop: 6,
              fontWeight: 700,
            }}
          >
            Waitlist available
          </p>
        )}
      </div>

      {actions && (
        <div className="soft-card-actions" style={{ marginTop: 16 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Upcoming: "badge-green",
    Ongoing: "badge-yellow",
    Past: "badge-red",
    Cancelled: "badge-red",
  };

  return <span className={`badge ${map[status] || "badge-blue"}`}>{status}</span>;
}

export function formatDate(dt) {
  if (!dt) return "—";

  return new Date(dt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}