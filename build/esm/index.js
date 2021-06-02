import { hostname } from 'os';

function getHostName() {
    const host_name = hostname();
    return host_name;
}

export { getHostName };
