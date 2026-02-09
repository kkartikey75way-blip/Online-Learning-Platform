export interface AxiosError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export function isAxiosError(error: unknown): error is AxiosError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
    );
}

export function getErrorMessage(error: unknown, defaultMessage = "An error occurred"): string {
    if (isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
}
