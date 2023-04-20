export default function getCurrentPosition() {
    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 1500,
    };
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
                resolve([lng, lat]);
            },
            (error) => {
                console.log(error)
                resolve([])
            },
            options,
        );
        }
    });
};