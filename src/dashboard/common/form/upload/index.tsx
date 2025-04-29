export const emptyTemplate = (label: string) => {
    return (
        <div className='grid'>
            <div className='flex align-items-center flex-column col-12'>
                <i className='adms-upload media__upload-icon' />
                <span className=' media__upload-icon-label'>Drag and drop {label} here</span>
            </div>
            <div className='col-12 flex justify-content-center align-items-center media__upload-splitter'>
                <hr className='media__line mr-4 flex-1' />
                <span>or</span>
                <hr className='media__line ml-4 flex-1' />
            </div>
        </div>
    );
};
