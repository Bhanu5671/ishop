"use client"

import React, { useState, useRef, useMemo } from 'react';
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), {
	ssr: false,
});

const RichTextEditor = ({ placeholder, value, changeHandler, defaultValue }) => {
	const editor = useRef(null);

	const config = useMemo(() => ({
		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
		placeholder: placeholder || 'Start typings...'
	}),
		[placeholder]
	);

	return (
		<JoditEditor
			ref={editor}
			value={value}
			defaultValue={defaultValue}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onChange={(newData) => {
				changeHandler(newData)
			}}
		/>
	);
};

export default RichTextEditor;