'use client';

import { useEffect, useState } from 'react';
import SearchModal from '../search-modal';
import { Input } from '@medusajs/ui';
import { MagnifyingGlass } from '@medusajs/icons';

export default function SearchModalWrapper() {
    const [searchOpened, setSearchOpened] = useState(false);

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key == 'k') {
                setSearchOpened(true);
            }
        });
    }, []);

    return (
        <>
            <Input
                type="search"
                placeholder="Search  "
                className="!bg-black !text-white"
                onClick={() => {
                    setSearchOpened(true);
                }}
            ></Input>
            {searchOpened && (
                <SearchModal
                    closeModal={() => {
                        setSearchOpened(false);
                    }}
                />
            )}
        </>
    );
}
