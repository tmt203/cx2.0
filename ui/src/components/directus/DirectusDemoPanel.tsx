"use client";

import { useEffect, useMemo, useState } from "react";

interface DemoItem {
	id: string | number;
	title?: string;
	description?: string;
	status?: string;
	created_at?: string;
	[key: string]: unknown;
}

interface DirectusDemoPanelProps {
	defaultCollection: string;
}

const parseError = async (response: Response): Promise<string> => {
	const fallback = `Request failed (${response.status})`;

	try {
		const payload = (await response.json()) as { message?: string };
		return payload.message || fallback;
	} catch {
		return fallback;
	}
};

const DirectusDemoPanel = ({ defaultCollection }: DirectusDemoPanelProps) => {
	const [collection, setCollection] = useState(defaultCollection);
	const [items, setItems] = useState<DemoItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [activeId, setActiveId] = useState<string | number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");

	const encodedCollection = useMemo(
		() => encodeURIComponent(collection.trim() || defaultCollection),
		[collection, defaultCollection]
	);

	const loadItems = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await fetch(`/api/directus-demo?collection=${encodedCollection}`, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error(await parseError(response));
			}

			const payload = (await response.json()) as { items: DemoItem[] };
			setItems(payload.items || []);
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Cannot load Directus items");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadItems();
	}, [encodedCollection]);

	const createItem = async () => {
		setError("");

		try {
			const response = await fetch(`/api/directus-demo?collection=${encodedCollection}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: title.trim() || undefined,
					description: description.trim() || undefined,
				}),
			});

			if (!response.ok) {
				throw new Error(await parseError(response));
			}

			setTitle("");
			setDescription("");
			await loadItems();
		} catch (requestError) {
			setError(
				requestError instanceof Error ? requestError.message : "Cannot create Directus item"
			);
		}
	};

	const selectForEdit = (item: DemoItem) => {
		setActiveId(item.id);
		setEditTitle(item.title?.toString() || "");
		setEditDescription(item.description?.toString() || "");
	};

	const updateItem = async () => {
		if (activeId === null) {
			return;
		}

		setError("");

		try {
			const response = await fetch(
				`/api/directus-demo?collection=${encodedCollection}&id=${activeId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title: editTitle,
						description: editDescription,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(await parseError(response));
			}

			setActiveId(null);
			await loadItems();
		} catch (requestError) {
			setError(
				requestError instanceof Error ? requestError.message : "Cannot update Directus item"
			);
		}
	};

	const deleteItem = async (id: string | number) => {
		setError("");

		try {
			const response = await fetch(`/api/directus-demo?collection=${encodedCollection}&id=${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(await parseError(response));
			}

			if (activeId === id) {
				setActiveId(null);
			}
			await loadItems();
		} catch (requestError) {
			setError(
				requestError instanceof Error ? requestError.message : "Cannot delete Directus item"
			);
		}
	};

	return (
		<section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Directus CRUD demo</h2>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				Try read, create, update, and delete records from your Directus collection.
			</p>

			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
				<label className="text-sm text-gray-700 dark:text-gray-200" htmlFor="collection-input">
					Collection
				</label>
				<input
					id="collection-input"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
					value={collection}
					onChange={(event) => setCollection(event.target.value)}
					placeholder="demo_posts"
				/>
				<button
					type="button"
					onClick={() => void loadItems()}
					className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					Reload
				</button>
			</div>

			<div className="mt-6 grid gap-3 sm:grid-cols-2">
				<input
					className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Title"
				/>
				<input
					className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
					value={description}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Description"
				/>
			</div>
			<button
				type="button"
				onClick={() => void createItem()}
				className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-300"
			>
				Create item
			</button>

			{error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

			<div className="mt-6 space-y-3">
				{loading ? (
					<p className="text-sm text-gray-500 dark:text-gray-300">Loading items...</p>
				) : null}
				{!loading && items.length === 0 ? (
					<p className="text-sm text-gray-500 dark:text-gray-300">
						No records found in this collection.
					</p>
				) : null}
				{items.map((item) => {
					const isEditing = activeId === item.id;

					return (
						<article
							key={item.id}
							className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
						>
							<p className="text-xs text-gray-500 dark:text-gray-400">ID: {item.id}</p>
							{isEditing ? (
								<div className="mt-2 space-y-2">
									<input
										className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
										value={editTitle}
										onChange={(event) => setEditTitle(event.target.value)}
									/>
									<input
										className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
										value={editDescription}
										onChange={(event) => setEditDescription(event.target.value)}
									/>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => void updateItem()}
											className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
										>
											Save
										</button>
										<button
											type="button"
											onClick={() => setActiveId(null)}
											className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className="mt-2">
									<p className="text-base font-medium text-gray-900 dark:text-white">
										{item.title?.toString() || "(no title)"}
									</p>
									<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
										{item.description?.toString() || "(no description)"}
									</p>
									<div className="mt-3 flex gap-2">
										<button
											type="button"
											onClick={() => selectForEdit(item)}
											className="rounded-lg border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-950"
										>
											Edit
										</button>
										<button
											type="button"
											onClick={() => void deleteItem(item.id)}
											className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-950"
										>
											Delete
										</button>
									</div>
								</div>
							)}
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default DirectusDemoPanel;
