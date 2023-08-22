doExec();

async function doExec() {
    const response = await fetch('http://localhost:7071/api/orchestrators/haibunFunctionPocOrchestrator');
    const json = await response.json();
    const statusQueryGetUri = json.statusQueryGetUri;
    let statusJson;
    const checking = setInterval(async () => {
        const statusResponse = await fetch(statusQueryGetUri);
        statusJson = await statusResponse.json();
        const { runtimeStatus, output } = statusJson;
        // get statusJson until the durable function is finished
        console.log('statusJson', statusJson)
        if (runtimeStatus === 'Completed') {
            console.log('output', JSON.stringify(statusJson.output, null, 2));
            clearInterval(checking);
        }
    }, 1000);
}