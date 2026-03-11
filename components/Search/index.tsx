"use client";

import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

type Props = {
  search: string;
};
const Search = ({ search }: Props) => {
  const [keyword, setKeyword] = useState<string>(search);
  const router = useRouter();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === "Enter") {
      const params = new URLSearchParams(window.location.search);
      if (keyword.trim()) {
        params.set("search", keyword);
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="w-full">
      <input
        id="keyword"
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Keyword of search"
        onKeyUp={(event) => handleSearch(event)}
        className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
export default Search;