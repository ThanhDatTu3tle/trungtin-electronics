export class Helper {
    public static formatDateTime(input: string): string {
        const dt = new Date(input);

        const hh = dt.getHours().toString().padStart(2, '0');
        const mm = dt.getMinutes().toString().padStart(2, '0');
        const day = dt.getDate().toString().padStart(2, '0');
        const month = (dt.getMonth() + 1).toString().padStart(2, '0');
        const year = dt.getFullYear();

        return `${hh}:${mm} ${day}/${month}/${year}`;
    }
}