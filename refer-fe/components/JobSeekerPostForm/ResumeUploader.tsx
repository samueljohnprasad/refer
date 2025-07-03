import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../../context/ThemeContext";

interface ResumeUploaderProps {
    onFileSelected: (uri: string) => void;
    currentFile?: string;
}

const Container = styled.View`
    margin-top: 12px;
    margin-bottom: 16px;
`;

const Label = styled.Text`
    font-size: ${(props) => props.theme.typography.fontSize.sm}px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
    font-weight: 500;
`;

const Description = styled.Text`
    font-size: ${(props) => props.theme.typography.fontSize.xs}px;
    color: ${(props) => props.theme.colors.text};
    opacity: 0.6;
    margin-bottom: 12px;
`;

const UploadArea = styled.TouchableOpacity`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    border-style: dashed;
    border-radius: 8px;
    padding: 24px;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.colors.background};
`;

const UploadText = styled.Text`
    font-size: ${(props) => props.theme.typography.fontSize.sm}px;
    color: ${(props) => props.theme.colors.primary};
    margin-top: 8px;
    text-align: center;
`;

const FilePreview = styled.View`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.success};
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => props.theme.colors.success}10;
`;

const FileIcon = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: ${(props) => props.theme.colors.success}30;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`;

const FileInfo = styled.View`
    flex: 1;
`;

const FileName = styled.Text`
    font-size: ${(props) => props.theme.typography.fontSize.sm}px;
    color: ${(props) => props.theme.colors.text};
    font-weight: bold;
    margin-bottom: 2px;
`;

const FileSize = styled.Text`
    font-size: ${(props) => props.theme.typography.fontSize.xs}px;
    color: ${(props) => props.theme.colors.text};
    opacity: 0.6;
`;

const RemoveButton = styled.TouchableOpacity`
    padding: 8px;
`;

export default function ResumeUploader({
    onFileSelected,
    currentFile,
}: ResumeUploaderProps) {
    const { theme } = useTheme();
    const [file, setFile] = useState<string | undefined>(currentFile);
    const [loading, setLoading] = useState(false);

    // Mock implementation for resume upload
    const pickDocument = () => {
        setLoading(true);

        // Simulate a delay
        setTimeout(() => {
            // Mock file data
            const mockFileName = "my_professional_resume.pdf";
            const mockFileUri = "https://example.com/resume.pdf"; // This would be the actual file URI in a real implementation

            setFile(mockFileName);
            onFileSelected(mockFileUri);
            setLoading(false);

            Alert.alert("Mock Resume Selected");
        }, 1000);
    };

    const removeFile = () => {
        setFile(undefined);
        onFileSelected("");
    };

    return (
        <Container>
            <Label>Upload Resume*</Label>
            <Description>
                Upload your resume to help referrers understand your background
                and experience (PDF or DOC, max 5MB)
            </Description>

            {!file ? (
                <UploadArea onPress={pickDocument}>
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : (
                        <>
                            <FontAwesome
                                name="file-pdf-o"
                                size={36}
                                color={theme.colors.primary}
                            />
                            <UploadText>
                                Click to upload resume{"\n"}(PDF, DOC, DOCX)
                            </UploadText>
                        </>
                    )}
                </UploadArea>
            ) : (
                <FilePreview>
                    <FileIcon>
                        <FontAwesome
                            name="file-pdf-o"
                            size={24}
                            color={theme.colors.success}
                        />
                    </FileIcon>
                    <FileInfo>
                        <FileName>{file}</FileName>
                        <FileSize>PDF document, 1.2 MB</FileSize>
                    </FileInfo>
                    <RemoveButton onPress={removeFile}>
                        <FontAwesome
                            name="trash-o"
                            size={20}
                            color={theme.colors.error}
                        />
                    </RemoveButton>
                </FilePreview>
            )}
        </Container>
    );
}
