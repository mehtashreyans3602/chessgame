import React from 'react';
import styles from './Polygon.module.css';

/**
 * Polygon Component - Represents a single chess square
 * @param {Object} props
 * @param {string} props.id - Polygon ID (e.g., "Ba1", "Rg3")
 * @param {string} props.points - SVG polygon points
 * @param {string} props.color - Polygon color ('blue', 'green', 'red')
 * @param {string} props.shade - Shade variant ('light', 'dark')
 * @param {boolean} props.isHighlighted - Whether polygon is highlighted
 * @param {Function} props.onClick - Click handler
 */
const Polygon = ({ id, points, color, shade, isHighlighted, onClick }) => {
    const handleClick = () => {
        onClick(id);
    };

    const classNames = [
        styles.polygon,
        styles[color],
        styles[shade],
        isHighlighted ? 'highlight' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <polygon
                id={id}
                className={classNames}
                points={points}
                onClick={handleClick}
            />
            {/* Polygon label for debugging/reference */}
            <text
                x={getPolygonCenterX(points)}
                y={getPolygonCenterY(points)}
                className={styles.label}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {id.toUpperCase()}
            </text>
        </>
    );
};

/**
 * Helper function to calculate polygon center X coordinate
 */
const getPolygonCenterX = (pointsString) => {
    const points = pointsString.split(' ');
    if (points.length < 3) return 0;

    const firstPoint = points[0].split(',');
    const thirdPoint = points[2].split(',');

    return (parseFloat(firstPoint[0]) + parseFloat(thirdPoint[0])) / 2;
};

/**
 * Helper function to calculate polygon center Y coordinate
 */
const getPolygonCenterY = (pointsString) => {
    const points = pointsString.split(' ');
    if (points.length < 3) return 0;

    const firstPoint = points[0].split(',');
    const thirdPoint = points[2].split(',');

    return (parseFloat(firstPoint[1]) + parseFloat(thirdPoint[1])) / 2;
};

export default Polygon;