import React, { Suspense } from "react";

const CardSvg = ({ name }) => {
	const Svg = React.lazy(() => import(`../assets/${name}.svg`));

	return (
		<Suspense fallback={<p>loading...</p>}>
			<Svg />
		</Suspense>
	);
};

export default CardSvg;
