const wsUrl = import.meta.env.VITE_API_URL;
let vitonWc = null;

/**
 * Generate a virtual try-on using WebSocket
 * @param {object} params - The parameters for the virtual try-on
 * @param {function} onEvent - A callback function to handle events during the generation process
 */
export const generateViton = (params, onEvent) => {
    const sessionHash = Math.random().toString(36).substring(2, 12);

    if (vitonWc) {
        vitonWc.close();
        vitonWc = null;
    }

    vitonWc = new WebSocket(`${wsUrl}/queue/join`);

    vitonWc.onopen = () => {
        vitonWc.send(JSON.stringify({ fn_index: 2, session_hash: sessionHash }));
    };

    vitonWc.onmessage = (e) => {
        const data = JSON.parse(e.data);
        onEvent(data);

        switch (data.msg) {
            case 'send_data':
                    vitonWc.send(JSON.stringify({
                        fn_index: 2, session_hash: sessionHash, event_data: null,
                        data: [
                            params.model,
                            params.garment,
                            params.steps,
                            false
                        ]
                    }));
                break;
            case 'process_completed':
                vitonWc.close();
                break;
        }
    };

    vitonWc.onerror = (e) => {
        console.log('WebSocket error', e);
        onEvent({ msg: 'error', error: 'Failed to generate. Try again later.' });
        vitonWc.close();
    };

    vitonWc.onclose = () => {};
};

/**
 * Stop the virtual try-on generation process
 */
export const stopVitonGeneration = () => {
    if (vitonWc) {
        vitonWc.close();
        vitonWc = null;
    }
};