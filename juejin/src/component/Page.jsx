import react from 'react';

const Page = ({codeString})=>{
    return(
        <div dangerouslySetInnerHTML={{ __html: codeString }} />
    )
}

export default Page;