import React from "react";

interface Props {
  title: string;
  color?: string;
}

function PageTitle({ title, color }: Props) {
  return <h1 style={{ color: color || "inherit" }}>{title}</h1>;
}

export default PageTitle;

// import React from 'react'

// interface Props {
//     title: string
// }

// function PageTitle({title}: Props) {
//     return (
//         <h1>{title}</h1>
//     )
// }

// export default PageTitle
