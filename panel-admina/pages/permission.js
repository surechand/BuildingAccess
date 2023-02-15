import Head from "next/head";

const email = localStorage.getItem(name);

export default function Home() {

    return (
        <div>
            <Head>
                <title>Panel administratora</title>

            </Head>
            <main >
                <h1 >{email}
                </h1>
            </main>
        </div>
    )
}
